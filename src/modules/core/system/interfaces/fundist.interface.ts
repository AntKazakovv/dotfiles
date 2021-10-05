export interface ICountry {
    phoneCode: string;
    title: string;
    value: string;
}

export interface ICountries {
    countries: ICountry[];
    lang: string;
}
