if (localStorage.getItem("auth") == null) {
    localStorage.setItem("auth", "true");
}
var articleLibrary = [{
        'title': 'Menacing Meningitis',
        'filename': 'menacing-meningitis'
    },
    {
        'title': 'Meet the Microbes',
        'filename': 'meet-the-microbes'
    },
    {
        'title': 'Doctor with an eye for eyes',
        'filename': 'doctor-with-an-eye-for-eyes'
    },
    {
        'title': 'Spring after Spring',
        'filename': 'spring-after-spring'
    },
    {
        'title': 'Lia & Luis',
        'filename': 'lia-and-luis'
    },
    {
        'title': 'Hey Water',
        'filename': 'hey-water'
    },
    {
        'title': 'Astronaut Annie',
        'filename': 'astronaut-annie'
    },
    {
        'title': 'Girl versus Squirrel',
        'filename': 'girl-versus-squirrel'
    },
    {
        'title': 'What Miss Mitchell Saw',
        'filename': 'what-miss-mitchell-saw'
    },
    {
        'title': 'Mary Had a Little Lab',
        'filename': 'mary-had-a-little-lab'
    },
    {
        'title': 'The Little Red Fort',
        'filename': 'the-little-red-fort'
    },
    {
        'title': 'The Camping Trip',
        'filename': 'the-camping-trip'
    },
    {
        'title': 'Cold Nose Article',
        'filename': 'cold_nose_article',
        'from': new Date('2025-02-04T10:00:00'),
        'to': new Date('2025-02-16T13:30:00')
    },
    {
        'title': 'Exoplanet Article',
        'filename': 'exoplanet_article',
        'from': new Date('2025-02-16T13:31:00'),
        'to': new Date('2025-02-26T16:30:00')
    },
    {
        'title': 'Osmosis Article',
        'filename': 'osmosis_article',
        'from': new Date('2025-02-26T16:31:00'),
        'to': new Date('2025-03-05T16:30:00')
    },
    {
        'title': 'Frogs Evaluation Article',
        'filename': 'frogs_evolution_article'
    },
    {
        'title': 'Soils & Nutrient Cycle',
        'filename': 'table_readings_1'
    },
    {
        'title': 'Earthworms Article',
        'filename': 'table_readings_2'
    },
    {
        'title': 'Consume vs Consumed',
        'filename': 'table_readings_3'
    },
    {
        'title': 'An Alive Bug?',
        'filename': 'table_readings_4'
    },
    {
        'title': 'Nitrogen Cycle',
        'filename': 'table_readings_5'
    },
    {
        'title': 'Carbon Cycle',
        'filename': 'table_readings_6'
    },
    {
        'title': 'Recycling the Dead',
        'filename': 'table_readings_7'
    },
    {
        'title': 'Gut Bacteria',
        'filename': 'table_readings_8'
    }
];
var articleList = [];
var groups = [{
        'name': 'Group 1',
        'id': 'group-1',
        'password': 'test1',
        'articles': [articleLibrary[10], articleLibrary[11], articleLibrary[12]]
    },
    {
        'name': 'Group 2',
        'id': 'group-2',
        'password': 'test2',
        'articles': [articleLibrary[0], articleLibrary[1]]
    }
];
var articles = [
    articleLibrary[0],
    articleLibrary[1],
    articleLibrary[2],
    articleLibrary[3],
    articleLibrary[4],
    articleLibrary[5],
    articleLibrary[6],
    articleLibrary[7],
    articleLibrary[8],
    articleLibrary[9],
    articleLibrary[10],
    articleLibrary[11]
];
var articlesPrev = [
    articleLibrary[12],
    articleLibrary[13],
    articleLibrary[14],
    articleLibrary[15],
    articleLibrary[16],
    articleLibrary[17],
    articleLibrary[18],
    articleLibrary[19],
    articleLibrary[20],
    articleLibrary[21],
    articleLibrary[22],
    articleLibrary[23]
];
if (localStorage.getItem("auth") == "guest") {
    articleList = articles;
} else {
    groups.forEach(function(v) {
        if (v.id == localStorage.getItem("auth")) {
            articleList = v.articles;
        }
    });
}
if (localStorage.getItem("currentArticle") === null) {
    localStorage.setItem("currentArticle", articleList[0].filename);
    localStorage.setItem("currentArticleTitle", articleList[0].title);
}