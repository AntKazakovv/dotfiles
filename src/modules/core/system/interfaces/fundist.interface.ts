export interface ICountry {
    phoneCode: number;
    title: string;
    value: string;
}

export interface ICountries {
    countries: ICountry[];
    lang: string;
}
