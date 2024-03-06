if (localStorage.getItem("auth") == null) {
    localStorage.setItem("auth", "true");
}
var articleList = [];
var groups = [{
        'name': 'Group 1',
        'id': 'group-1',
        'password': 'test1',
        'articles': [{
                'title': 'Cold Nose Article',
                'filename': 'cold_nose_article'
            },
            {
                'title': 'Exoplanet Article',
                'filename': 'exoplanet_article'
            },
            {
                'title': 'Osmosis Article',
                'filename': 'osmosis_article'
            }
        ]
    },
    {
        'name': 'Group 2',
        'id': 'group-2',
        'password': 'test2',
        'articles': [{
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
            }
        ]
    }, {
        'name': 'Group 3',
        'id': 'group-3',
        'password': 'test3',
        'articles': [{
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
            }
        ]
    }, {
        'name': 'Group 4',
        'id': 'group-4',
        'password': 'test4',
        'articles': [{
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
        ]
    }
];

var articles = [{
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
    }
];

// var articles = [{
//         'title': 'Cold Nose Article',
//         'filename': 'cold_nose_article'
//     },
//     {
//         'title': 'Exoplanet Article',
//         'filename': 'exoplanet_article'
//     },
//     {
//         'title': 'Osmosis Article',
//         'filename': 'osmosis_article'
//     },
//     {
//         'title': 'Frogs Evaluation Article',
//         'filename': 'frogs_evolution_article'
//     },
//     {
//         'title': 'Soils & Nutrient Cycle',
//         'filename': 'table_readings_1'
//     },
//     {
//         'title': 'Earthworms Article',
//         'filename': 'table_readings_2'
//     },
//     {
//         'title': 'Consume vs Consumed',
//         'filename': 'table_readings_3'
//     },
//     {
//         'title': 'An Alive Bug?',
//         'filename': 'table_readings_4'
//     },
//     {
//         'title': 'Nitrogen Cycle',
//         'filename': 'table_readings_5'
//     },
//     {
//         'title': 'Carbon Cycle',
//         'filename': 'table_readings_6'
//     },
//     {
//         'title': 'Recycling the Dead',
//         'filename': 'table_readings_7'
//     },
//     {
//         'title': 'Gut Bacteria',
//         'filename': 'table_readings_8'
//     }
// ];

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