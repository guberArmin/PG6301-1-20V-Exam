export function checkForDuplicates(players) {
    //Count number of duplicates and set displayed to false
    let duplicates = {};
    players.forEach(p => {
        //If this was counted before we have number of copies so we increase it
        //else we set it to 1
        duplicates[p.id] = {
            numberOfCopies: ((duplicates[p.id] !== null && duplicates[p.id] !== undefined ?
                duplicates[p.id].numberOfCopies+ 1
                : 1))
            , displayed: false
        };
    });
    return duplicates;
}

