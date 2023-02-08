
declare interface ServerResponse {
    result?: any
    error?: number
}

declare interface ResultType {
    err: string,
    result: string
}

interface WalletTypes{
    updated: number
    adminid: string
    adminname: string
    loading?: boolean
    currentPage: string
}
interface useStoreTypes extends WalletTypes {
    update(payload: { [key: string]: string | number | boolean | PendingTypes | TxTypes | CoinTypes })
    call(url: string, params?: any): Promise<ServerResponse | null>
}
