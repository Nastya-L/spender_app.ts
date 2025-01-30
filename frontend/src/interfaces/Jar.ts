export interface IJar {
    _id: string
    name: string
    color: string
    users: [{
        _id: string,
        firstName: string
    }]
    created: Date
    owner: string
}

export interface IInitialJars {
    jars: IJar[]
}
