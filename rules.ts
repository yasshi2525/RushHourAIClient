namespace RushHour {
    export const users: User[] = [
        {
            name: "circler001",
            strategy: {
                name: "circler",
                args: {
                    initRadius: 20,
                    initRadian: 0,
                    clockwise: true
                }
            },
            latestStep: undefined
        },{
            name: "liner001",
            strategy: {
                name: "liner",
                args: {
                    initRadius: 30,
                    initRadian: 0
                }
            },
            latestStep: undefined
        }
    ]
}