if (localStorage.getItem("auth") == null) {
    localStorage.setItem("auth", "true");
}
var isProduction = false;

var homeworks = [{
        'title': 'Meet the Microbes and Meningitis',
        'homework': [
            { "text": "I'm a little confused, can you explain that to me?", "clip": "1001", "emotion": "6", "type": "1", "top": 249, "left": 528, "id": "c1" },
            { "text": "I THINK I understood, but could you summarize what that means for me?", "clip": "1002", "emotion": "4", "type": "1", "top": 884, "left": 651, "id": "c2" },
            { "text": "Is there something in your home that works this way?", "clip": "1003", "emotion": "3", "type": "3", "top": 1907, "left": 565, "id": "c3" }
        ]
    },
    {
        'title': 'Human Blood',
        'homework': [
            { "text": "Anis I'm a little confused, can you explain that to me?", "clip": "2001", "emotion": "5", "type": "1", "top": 249, "left": 528, "id": "c1" },
            { "text": "I THINK I understood, but could you summarize what that means for me?", "clip": "2002", "emotion": "2", "type": "1", "top": 884, "left": 651, "id": "c2" },
            { "text": "Is there something in your home that works this way?", "clip": "2003", "emotion": "5", "type": "3", "top": 1907, "left": 565, "id": "c3" }
        ]
    }
];

var prompts = [
    "Would you like to add anything else?",
    "Is there something else you'd like to say about this?",
    "Do you have any other thoughts to share?",
    "Would you like to continue with more input?",
    "Shall we add more to this discussion?",
    "Would you like to expand on that?",
    "Any additional thoughts you'd like to share?",
    "Should we continue with more ideas?",
    "Would you like to add another perspective?",
    "Anything else you'd like to contribute?"
];

var articleLibrary = [{
        'title': 'Meet the Microbes and Meningitis',
        'filename': 'meet_the_microbes_and_meningitis',
        'from': new Date('2025-03-12T10:00:00'),
        'to': new Date('2025-03-28T13:30:59')
    },
    {
        'title': 'Human Blood',
        'filename': 'human_blood',
        'from': new Date('2025-03-28T13:31:00'),
        'to': new Date('2025-04-18T13:30:59')
    },
    {
        'title': 'Cells in the Human Body',
        'filename': 'cells_in_the_human_body'
    },
    {
        'title': 'What are Vaccines',
        'filename': 'what_are_vaccines'
    },
    {
        'title': 'What are Antibodies',
        'filename': 'what_are_antibodies'
    },
    {
        'title': 'Illness Carried by Bugs',
        'filename': 'illness_carried_by_bugs'
    },
    {
        'title': 'Justin Beiber and Lyme Disease',
        'filename': 'justin_beiber_and_lyme_disease'
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
        'from': new Date('2025-03-12T10:00:00'),
        'to': new Date('2025-03-28T13:30:59')
    },
    {
        'title': 'Exoplanet Article',
        'filename': 'exoplanet_article',
        'from': new Date('2025-03-28T13:31:00'),
        'to': new Date('2025-04-18T13:30:59')
    },
    {
        'title': 'Osmosis Article',
        'filename': 'osmosis_article'
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
        'articles': [articleLibrary[0], articleLibrary[1]] //, articleLibrary[2], articleLibrary[3], articleLibrary[4], articleLibrary[5], articleLibrary[6]
    },
    {
        'name': 'Group 2',
        'id': 'group-2',
        'password': 'test2',
        'articles': [articleLibrary[17], articleLibrary[18]]
    }
];
var articles = [
    articleLibrary[7],
    articleLibrary[8],
    articleLibrary[9],
    articleLibrary[10],
    articleLibrary[11],
    articleLibrary[12],
    articleLibrary[13],
    articleLibrary[14],
    articleLibrary[15],
    articleLibrary[16]
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
    if (!localStorage.getItem("auth")) {
        localStorage.setItem("currentArticle", articleList[0].filename);
        localStorage.setItem("currentArticleTitle", articleList[0].title);
    } else {
        localStorage.setItem("currentArticle", articleLibrary[0].filename);
        localStorage.setItem("currentArticleTitle", articleLibrary[0].title);
    }
}