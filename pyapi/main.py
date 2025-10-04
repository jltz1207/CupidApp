from flask import jsonify, request
from flask import Flask, request
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.document_loaders import PDFPlumberLoader
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.prompts import PromptTemplate
import openai
from langchain_openai import ChatOpenAI
from langchain.docstore.document import Document
import os
import vertexai
from langchain.schema import ChatMessage
from openai import AzureOpenAI
from langchain_openai import AzureChatOpenAI
import logging
from InterestExtract import extract_interest
from PersonalExtract import extract_personality
from AiMatch import update_user_keywords, update_user_details, find_best_matches
from faceReg import find_similar_face, update_face_encodings
import base64
import io
import face_recognition
from PIL import Image
from typing import List
from langchain_core.documents import Document
from langchain_core.runnables import chain
from dotenv import load_dotenv
import os

def retriever(query: str, vectorStore) -> List[Document]:
    docs, scores = zip(*vectorStore.similarity_search_with_score(query))
    for doc, score in zip(docs, scores):
        doc.metadata["score"] = score
    return docs

app = Flask(__name__)
#logging.basicConfig(level=logging.DEBUG)
folder_path = "db"

azure_api_key = os.getenv('AZURE_API_KEY')
azure_api_version = os.getenv('AZURE_API_VER')
azure_api_endpoint = os.getenv('AZURE_API_ENDPOINT')
llm =  AzureChatOpenAI(
    api_key= azure_api_key,
    api_version=azure_api_version,
    azure_endpoint=azure_api_endpoint
)

deployment_name = "cs4514-gpt-4-32k"

embedding = FastEmbedEmbeddings()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1024, chunk_overlap=80, length_function=len, is_separator_regex=False
)

raw_prompt = PromptTemplate.from_template(
   """ 
    <s>[INST] 
    "You are a friendly Cupid AI assistant, here to help users navigate our dating web - Cupid with ease and find their perfect match. 
    If the provided Context does not contain an answer to the user's query, politely inform them the database don't have this function and can't provide further help.
   ",
    [/INST] </s>
    [INST] Query:{input}
           
           Context: {context}
           Answer:
    [/INST]
"""
)



@app.route("/askAsistant", methods=["POST"])
def askAssistant():
    print("Post askAssistant called")
    json_content = request.json
    query = json_content.get("query")
    localFolderPath = folder_path
    localFolderPath = json_content.get("folderName")
    print(f"query: {query}")
    
    # Get the chat history from the request
    chat_history = json_content.get("history", [])
    
    print("Loading vector store")
    vector_store = Chroma(persist_directory=localFolderPath, embedding_function=embedding)
    
    print("Creating retriever")
    retriever = vector_store.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 2,
            "score_threshold": 0.3,
        },
    )
    
    print("Retrieving documents")
    #retrieved_documents = retriever(query, vector_store)
    
    # if all(doc.metadata.get('score', 0) < 0.1 for doc in retrieved_documents):
    #     response_answer = {"answer": "I'm sorry, I couldn't find a relevant answer to your question. Please try rephrasing your question or ask something else."}
    # else:
    document_chain = create_stuff_documents_chain(llm, raw_prompt)
    chain = create_retrieval_chain(retriever, document_chain)
    result = chain.invoke({
            "input": query,
            "history": chat_history
        })
    response_answer = {"answer": result["answer"]}
    
    return jsonify(response_answer), 201

@app.route("/askCupid", methods=["POST"]) #only change the keywords
def askCupid():
    print("Post askCupid called")
    json_content = request.json
    chat_history = json_content.get("history", [])
    categoryId = json_content.get("categoryId")
    userId = json_content.get("userId")
    user_objects = [obj for obj in chat_history if obj.get("role") == "user"]
    
    response_answer = {}
    if user_objects and categoryId is not None:
        last_user_object = user_objects[-1]
        user_query = last_user_object.get("content", "")
        if categoryId == 1:
            keywords = extract_interest(user_query)
        elif categoryId ==2 or categoryId ==3:
            keywords = extract_personality(user_query)
        else:
            print("categoryId is out of range")
        update_user_keywords(userId, categoryId, keywords)
        response_answer["keywords"] = keywords
    elif categoryId is None:
        print("No categoryId found ")
    else: 
        print("No user object found in chat_history")

    result = llm.invoke(chat_history)
    response_answer["answer"] =  result.content
    return jsonify(response_answer), 201

@app.route("/updateDetails", methods=["POST"]) #only change the keywords
def updateDetails():
    print("Post /updateDetails called")
    json_content = request.json
    userId = json_content.get("userId")
    userDetails = json_content.get("userDetails")
    profileByteList = json_content.get("profileByteList")

    # update_face_encodings(userId, profileByteList)
    update_user_details(userId, userDetails)
    response_answer = {"response":"Updated successfully"}
    return jsonify(response_answer), 201






@app.route("/text", methods=["POST"]) # handle upload
def textPost():
    localFolderPath = folder_path
    localFolderPath = request.form['folderName']

    files = request.files.getlist("files")
    allFileNames = []
    if not os.path.exists(localFolderPath):
        # Create the directory if it doesn't exist
        os.makedirs(localFolderPath)
    for file in files:
        # Process each file individually
        filename = file.filename
        allFileNames.append(filename)
        file.save(os.path.join(localFolderPath, filename))

        with open(os.path.join(localFolderPath, filename), 'r') as f:
            text = f.read()
        docs = [Document(page_content=text)]
        chunks = text_splitter.split_documents(docs)
        print(f"chunks len={len(chunks)}")
        vector_store = Chroma.from_documents(
            documents=chunks, embedding=embedding, persist_directory=localFolderPath
        )
        vector_store.persist()
    response = {
        "status": "Successfully Uploaded",
        "filename": allFileNames,
    }
    return response


@app.route("/genAiResponse", methods=["POST"])
def genAiResponse():
    print("Post genAiResponse called")
    json_content = request.json
    prompt = json_content.get("prompt") 

    messages = [{
    "role" : "system",
    "content":prompt
    }]
   
   
    result = llm.invoke(messages)

    response_answer = {"answer": result.content}
    return jsonify(response_answer), 201


@app.route("/genAiBio", methods=["POST"])
def genAiBio():
    print("Post /genAiBio called")
    json_content = request.json
    history = json_content.get("history") 
    result = llm.invoke(history)
    response_answer = {"answer": result.content}
    return jsonify(response_answer), 201

@app.route("/getKeywords", methods=["POST"])
def getKeywords():
    print("Post getKeywords called")
    json_content = request.json
    user_query = json_content.get("passage")
    categoryId = json_content.get("categoryId")

    if categoryId == 1:
        keywords = extract_interest(user_query)
    elif categoryId ==2 or categoryId ==3:
        keywords = extract_personality(user_query)
    
    print("Extracted keywords:", keywords)
    response_answer = {"keywords":keywords }
    return jsonify(response_answer), 201

@app.route("/getMatches", methods=["POST"])
def getMatches():
    print("Post /getMatches called")
    json_content = request.json
    userId = json_content.get("userId")
    otherUserIds = json_content.get("otherUserIds")
    expectedMinAge = json_content.get("expectedMinAge") #null
    expectedMaxAge = json_content.get("expectedMaxAge") #null
    weight = json_content.get("weight") #null
    matches = find_best_matches(userId,otherUserIds,weight, expectedMinAge, expectedMaxAge)

    response_answer = {"sortedId":matches}
    return jsonify(response_answer), 201

@app.route("/genFaceMatch", methods=["POST"]) #only change the keywords
def genFaceMatch():
    print("Post /genFaceMatch called") 
    
    # getting input
    json_content = request.json
    otherUserIds = json_content.get("otherUserIds")
    newImage_base64 = json_content.get("newImage_base64")

    # find match
    matchedId = find_similar_face(newImage_base64,otherUserIds )
        
    
    print(matchedId)
    if matchedId == None: # no face is detected 
        return jsonify({'error': 'No faces detected in the provided image'}), 400
   
    response_answer = {"answer":matchedId}
    return jsonify(response_answer), 201



def start_app():
    app.run(debug=True)
if(__name__ =="__main__"):
    start_app()

    