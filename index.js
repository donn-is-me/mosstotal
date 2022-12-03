function getProxy(url) {
    return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { cache: "reload" });
}

const games = {
    sphd: 1,
    spc: 17,
    sp2: 20
};


async function main() {
    const start = new Date();
    const startTime = start.getTime();

    let users = {};

    for (let key in games) {
        let value = games[key];
        let response = await getProxy(`https://mossranking.com/api/getrankings.php?id_ranking=${value}`);
        let ranking_str = await response.json();
        let ranking = JSON.parse(ranking_str.contents);
        let runners = ranking["runners"];

        for (let runner of runners) {
            let id = runner.id_user;
            let name = runner.username;
            let points = Number(runner.points);

            if (users[id] == null) {
                users[id] = {
                    name,
                    points: 0,
                    url: `https://mossranking.com/user.php?id_user=${id}`
                };
            }
            users[id].points += points;
        }
    }

    const end = new Date();
    const endTime = end.getTime();

    let listing = Object.values(users);
    listing = listing.sort((a, b) => b.points - a.points)

    document.getElementById("status_message").innerHTML = `Generated using the Mossranking API in ${(endTime - startTime) / 1000}s.`

    let ranking = document.getElementById("ranking");
    let i = 1;
    for (let user of listing) {
        let row = document.createElement("tr");

        let rank = document.createElement("td");
        rank.innerHTML = i;
        row.appendChild(rank);

        let name = document.createElement("td");
        let link = document.createElement("a");
        link.href = user.url;
        link.innerHTML = user.name;
        name.appendChild(link);
        row.appendChild(name);

        let points = document.createElement("td");
        points.innerHTML = user.points;
        row.appendChild(points);

        ranking.appendChild(row);

        i += 1;
    }
}



addEventListener("load", () =>
    main().catch(err => {
        console.error(err);
        document.getElementById("status_message").innerHTML = `Error occurred while loading: ${err}`;
    })
);
