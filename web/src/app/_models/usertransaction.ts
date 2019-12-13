export interface UserTransaction{
    UserId? : number;
    ShareOwnerId? : number;
    UserProfileId?: number;
    DisplayName?: string;
    Age?: number;
    City? : string;
    ShareSymbol?: string;
    AvailableShareQty?: number;
    LastTradeSharePrice?: number;
    AskPrice?: number;
    BuyPrice?: number;
    PurchasedShareQty?: number;
    TotalValueAtCurrentPrice?: number;
    TotalValueAtPurchasedPrice?: number;
    ChangedPrice?: number;
    TotalMarketValue?: number;
    BuySellQty?: number;
    BuySellActionType?: number;
    ErrorMessage?: string;
    TotalPurchasedShareQty?: number;
    MarketCap?: number;
    Investors?: number;
    ProfitRLoss?: number;
    ProfitRLossPercentage?: number;
    pricechange?: number;
    PercentageValue?: number;
    profitlossinnegitive?: boolean;
    profitlosscolor?: string;
    color?: string;
    pricechangeinnegitive?: boolean;
    //    BuySellActionType - sell 1, buy - 2
    //    UserId - loggedIn User Id
    //    UserProfileId - profile Id
    //    BuySellQty
    LastDayClosePrice: number;
    TotalInvested?: number;
}