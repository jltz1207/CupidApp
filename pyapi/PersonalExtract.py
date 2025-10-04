from InterestExtract import correct_spelling
import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

patterns = [
    [{"POS": "ADJ"}, {"POS": "NOUN"}],  
    [{"POS": "NOUN"}, {"POS": "ADJ"}],  
    [{"POS": "ADJ"}],                   
    [{"POS": "NOUN"}]                   
]


matcher.add("personal_PHRASES", patterns)

def extract_personality(text):
    text = correct_spelling(text)
    doc = nlp(text)
    matches = matcher(doc)
    phrases = []
    
    for match_id, start, end in matches:
        span = doc[start:end]
        normalized_span = ' '.join([token.lemma_ for token in span if token.pos_ != 'DET'])
        phrases.append(normalized_span.lower())
    
    unique_phrases = sorted(set(phrases), key=lambda x: text.find(x))
    print("Extracted keywords:", unique_phrases)
    return unique_phrases


text = """
Emily is known for her vibrant and outgoing personality. She has a contagious enthusiasm for life and enjoys meeting 
new people and engaging in deep conversations. Her friends describe her as empathetic, creative, and adventurous.
"""

personality_keywords = extract_personality(text)
print(personality_keywords)