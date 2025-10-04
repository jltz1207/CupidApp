import { createContext, useContext } from "react";
import CommonStore from "./CommonStore";
import AccountStore from "./AccountStore";
import SummaryStore from "./SummaryStore";
import DiscoverStore from "./DiscoverStore";
import ConnectionStore from "./ConnectionStore";
import MatchStore from "./MatchStore";
import GptStore from "./GptStore";
import ReportStore from "./ReportStore";

interface Store{
    commonStore:CommonStore
    accountStore:AccountStore
    summaryStore:SummaryStore
    discoverStore:DiscoverStore
    connectionStore:ConnectionStore
    matchStore:MatchStore
    gptStore:GptStore
    reportStore:ReportStore
}

export const store:Store = {
    commonStore : new CommonStore(),
    accountStore : new AccountStore(),
    summaryStore: new SummaryStore(),
    discoverStore:new DiscoverStore(),
    connectionStore:new ConnectionStore(),
    matchStore:new MatchStore(),
    gptStore:new GptStore(),
    reportStore:new ReportStore()


}

export const StoreContext = createContext(store); // to share an obj

export function useStore() {
    return useContext(StoreContext);
}