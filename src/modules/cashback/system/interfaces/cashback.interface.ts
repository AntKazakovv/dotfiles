export interface ICashbackPlan {
    Amount: string;
    Available: boolean;
    AvailableAt: string;
    ExpiresAt: string;
    ID: string;
    Name: string;
    Period: string;
    Type: string;
}

export interface ICashbackReward {
    amount: string;
    currency: string;
}
