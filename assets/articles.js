if (localStorage.getItem("auth") == null) {
    localStorage.setItem("auth", "true");
}
var isRobotControl = true;
var isProduction = true;
var lastCustomComment = "c15";
var totalCommentCount  = 11;

var studentsList = [{
        'name': '1',
        'id': 'student-1',
        'current': 'Justin Beiber and Lyme Disease'
    },
    {
        'name': '3',
        'id': 'student-3',
        'current': 'Meet the Microbes'
    },
    {
        'name': '4',
        'id': 'student-4',
        'current': 'Human Blood'
    },
    {
        'name': '9',
        'id': 'student-9',
        'current': 'What are Antibodies'
    }
];

var homeworks = [{
        'title': 'Meet the Microbes',
        'homework': [
            { "text": "Wow, it's amazing to think about how tiny germs are and how they're everywhere around us without us even seeing them! Side note: What is smaller than tiny germs?", "emotion": "1", "type": "4", "top": 665, "left": 938, "id": "c1", "clip": "1001" },
            { "text": "Why is it important to avoid sharing utensils, drinking glasses, and toothbrushes? Do you share a lot during lunch time?", "emotion": "2", "type": "2", "top": 5454, "left": 622, "id": "c10", "clip": "1002" },
            { "text": "Huh? What do you think they mean when they say microorganisms?", "emotion": "1", "type": "2", "top": 743, "left": 1052, "id": "c2", "clip": "1003" },
            { "text": "Have you heard of other diseases caused by viruses in health class?", "emotion": "1", "type": "3", "top": 1490, "left": 1026, "id": "c3", "clip": "1004" },
            { "text": "Name another place in your home that matches  where bacteria love to live in.", "emotion": "2", "type": "2", "top": 1938, "left": 802, "id": "c4", "clip": "1005" },
            { "text": "Just like germs, some robots get a bad reputation, but most of us are here to assist and help in any way we can.", "emotion": "4", "type": "3", "top": 992, "left": 624, "id": "c5", "clip": "1006" },
            { "text": "Amoebic dysentery is a sickness that can make you have lots of loose poop, and it spreads when you drink bad water.", "emotion": "2", "type": "1", "top": 3053, "left": 668, "id": "c6", "clip": "1007" },
            { "text": "Huh? What do you think they mean when they say your body 'kills' germs? How does that happen without you knowing?", "emotion": "6", "type": "2", "top": 3659, "left": 580, "id": "c7", "clip": "1008" },
            { "text": "If antibiotics don't work against bacteria, then what does?", "emotion": "3", "type": "2", "top": 4023, "left": 936, "id": "c8", "clip": "1009" },
            { "text": "Is there someone in your home that makes sure you always wash up? How diligent are you in washing your hands?", "emotion": "1", "type": "3", "top": 4662, "left": 566, "id": "c9", "clip": "1010" },
            { "text": "", "emotion": "1", "type": "1", "top": 5802, "left": 622, "id": lastCustomComment, "clip": "" }
        ]
    },
    {
        'title': 'Human Blood',
        'homework': [
            { "text": "How do you think this might inform someone doing sports?", "emotion": "1", "type": "3", "top": 898, "left": 685, "id": "c1", "clip": "2001" },
            { "text": "It's heartwarming to know that volunteers selflessly donate blood, ensuring the safety of those in need.", "emotion": "4", "type": "4", "top": 2442, "left": 934, "id": "c10", "clip": "2002" },
            { "text": "Wow, our blood does so much to keep us healthy and alive!", "emotion": "6", "type": "4", "top": 1078, "left": 754, "id": "c2", "clip": "2003" },
            { "text": "I think when they're saying capillaries they mean a smaller type of artery and vein.", "emotion": "7", "type": "2", "top": 1451, "left": 347, "id": "c3", "clip": "2004" },
            { "text": "What is the role of platelets in our body when we get a cut or bruise?", "emotion": "1", "type": "2", "top": 1774, "left": 727, "id": "c4", "clip": "2005" },
            { "text": "It feels like red and white blood cells are a tag team. How would you summarize their roles in your own words?", "emotion": "1", "type": "2", "top": 2147, "left": 437, "id": "c5", "clip": "2006" },
            { "text": "It's heartbreaking to think about how much some people suffer and how vital blood transfusions are in helping them heal.", "emotion": "5", "type": "4", "top": 2317, "left": 867, "id": "c6", "clip": "2007" },
            { "text": "Hoooold on. How do you think blood can be separated? The cells are so small!", "emotion": "6", "type": "2", "top": 2619, "left": 516, "id": "c7", "clip": "2008" },
            { "text": "Did you know that an African American scientist, Charles Drew, was the first to come up with a way to store blood?", "emotion": "4", "type": "1", "top": 2769, "left": 390, "id": "c8", "clip": "2009" },
            { "text": "Does that mean blood is made in your bones? What do you think?", "emotion": "1", "type": "2", "top": 1610, "left": 966, "id": "c9", "clip": "2010" },
            { "text": "", "emotion": "1", "type": "1", "top": 3087, "left": 730, "id": lastCustomComment, "clip": "" }
        ]
    },
    {
        'title': 'What are Antibodies',
        'homework': [
            { "text": "Huh? What do you think they mean when they say, foreign substances?", "emotion": "1", "type": "2", "top": 1056, "left": 355, "id": "c1", "clip": "3001" },
            { "text": "Why do scientists have to make a new flu vaccine every year?", "emotion": "1", "type": "2", "top": 2899, "left": 799, "id": "c10", "clip": "3002" },
            { "text": "Hey, all those letters spell out GAME (IgG, IgA, IgM, IgE). That will help me remember them!", "emotion": "4", "type": "2", "top": 2271, "left": 746, "id": "c11", "clip": "3003" },
            { "text": "Your immune system is like a team of superheroes protecting you from harm! It's amazing how your body can defend itself against these microscopic invaders.", "emotion": "4", "type": "4", "top": 1185, "left": 348, "id": "c2", "clip": "3004" },
            { "text": "So in other words, white blood cells are also known as B cells.", "emotion": "7", "type": "1", "top": 1578, "left": 736, "id": "c3", "clip": "3005" },
            { "text": "Hoooold on. Can you tell me what plasma cells mean again?", "emotion": "6", "type": "2", "top": 1647, "left": 510, "id": "c4", "clip": "3006" },
            { "text": "How can we relate antibody's to crime fighters?", "emotion": "6", "type": "2", "top": 1838, "left": 316, "id": "c5", "clip": "3007" },
            { "text": "Which type of antibody or cell are you thankful to have in keeping you healthy?", "emotion": "7", "type": "2", "top": 2437, "left": 916, "id": "c7", "clip": "3008" },
            { "text": "Vaccines are like superheroes training the memory cells in your body to fight off the bad guys!", "emotion": "4", "type": "4", "top": 2662, "left": 404, "id": "c8", "clip": "3009" },
            { "text": "How would you explain this to someone else in class?", "emotion": "1", "type": "1", "top": 2773, "left": 437, "id": "c9", "clip": "3010" },
            { "text": "", "emotion": "1", "type": "1", "top": 3271, "left": 601, "id": lastCustomComment, "clip": "" }
        ]
    },
    {
        'title': 'Justin Beiber and Lyme Disease',
        'homework': [
            { "text": "Huh? What do you think they mean when they say, 'sickly appearance'? Have you ever noticed that about him?", "emotion": "2", "type": "2", "top": 1068, "left": 846, "id": "c1", "clip": "4001" },
            { "text": "That was a quick read. What three important points can you summarize from this article for me?", "emotion": "7", "type": "2", "top": 2471, "left": 299, "id": "c10", "clip": "4002" },
            { "text": "I can understand the struggles of battling a chronic illness like Lyme disease and the challenges it can bring to one's health, just like the pop star mentioned in the article.", "emotion": "5", "type": "3", "top": 1333, "left": 542, "id": "c2", "clip": "4003" },
            { "text": "What do you think makes certain diseases 'incurable?'", "emotion": "1", "type": "2", "top": 1445, "left": 321, "id": "c3", "clip": "4004" },
            { "text": "POPPY-SEED-SIZED! YIKES THAT'S SMALL! I wonder how we can avoid them?", "emotion": "3", "type": "4", "top": 1576, "left": 809, "id": "c4", "clip": "4005" },
            { "text": "Can you imagine how that feels?", "emotion": "1", "type": "4", "top": 1871, "left": 481, "id": "c5", "clip": "4006" },
            { "text": "That word sounds like 'mime'. What do you think 'mimic' means?", "emotion": "1", "type": "2", "top": 1900, "left": 722, "id": "c6", "clip": "4007" },
            { "text": "I can relate to the importance of early detection and treatment, as regular maintenance checks help prevent malfunctions and ensure optimal performance for robots like me too!", "emotion": "7", "type": "3", "top": 1970, "left": 388, "id": "c7", "clip": "4008" },
            { "text": "This reminds me of that class activity we did, where we created posters to inform other students what we learned. It looks like teaching others is valued.", "emotion": "4", "type": "1", "top": 2184, "left": 1081, "id": "c8", "clip": "4009" },
            { "text": "Is there another foundation that we talked about in class? It was something relating to the two way mirror project.", "emotion": "1", "type": "3", "top": 2341, "left": 794, "id": "c9", "clip": "4010" },
            { "text": "", "emotion": "1", "type": "1", "top": 2566, "left": 910, "id": lastCustomComment, "clip": "" }
        ]
    }
];

var prompts = [
    { "text": "Would you like to add anything else?", "clip": "1", "emotion": "100" },
    { "text": "Is there something else you'd like to say about this?", "clip": "2", "emotion": "100" },
    { "text": "Do you have any other thoughts to share?", "clip": "3", "emotion": "100" },
    { "text": "Would you like to continue with more input?", "clip": "4", "emotion": "100" },
    { "text": "Do you want to add more to this discussion?", "clip": "5", "emotion": "100" },
    { "text": "Would you like to expand on that?", "clip": "6", "emotion": "100" },
    { "text": "Any additional thoughts you'd like to share?", "clip": "7", "emotion": "100" },
    { "text": "Do you want to continue with more ideas?", "clip": "8", "emotion": "100" },
    { "text": "Would you like to add another perspective?", "clip": "9", "emotion": "100" },
    { "text": "Anything else you'd like to contribute?", "clip ": "10", "emotion ": "100" }
];

var positiveIntent = [{ "text" : "Great! Go ahead and tell me what else you'd like to add.", "clip": "21", "emotion": "4"  }];
var negativeIntent = [{ "text" : "Alright! Let's move on to the next part!", "clip": "22", "emotion": "1"  }];

var preIntros = [
    { "text": "Hey! I’m really looking forward to going through the article with you today. Before we jump in, here’s how we’ll work together: Whenever you spot a speech bubble in the article, give it a click, and I’ll know you’re ready for my question. After I ask, hold off on responding until my eyes turn green. If my eyes are red, I’m still talking, yellow means I’m mulling it over, and green means you can jump in! Ready to begin? Hit the start button.", "clip": "101", "emotion": "100" },
    { "text": "Hi! So excited to read through with you today. Let’s quickly go over how we’ll interact while reading: You’ll notice speech bubbles in the article—click on them to let me know you’re ready for a question. Once I ask, please wait for my eye color to change to green before answering. Red means I’m still speaking, yellow means I’m thinking, and green means it’s your turn! Once you’re good to go, just click the start button.", "clip": "102", "emotion": "100" },
    { "text": "Hey there! I’m super excited to read with you today. Before we get started, here’s a quick breakdown of how we’ll go about it: Whenever you see a speech bubble, click it so I know you’re ready for a question. After I ask, wait for my eye color to turn green before replying. If my eyes are red, I’m still talking; yellow means I’m processing; and green means it’s your turn to speak! Once you’re ready, just hit the start button.", "clip": "103", "emotion": "100" },
    { "text": "Hi! Excited to dive into this with you today. Before we begin, here’s how we’ll work together: When you see a speech bubble in the article, click it to let me know you’re ready for me to ask a question. After I ask, pause until you see my eyes turn green—only then should you reply. If my eyes are red, I’m still talking; yellow means I’m thinking; and green means it’s your time to respond! Once you’re set, just hit the start button.", "clip": "104", "emotion": "100" },
    { "text": "Hey! I’m thrilled to read with you today. Here’s how we can go about it: Every time you see a speech bubble, click on it so I know you’re ready for a question. After I ask, wait for my eye color to change to green before you respond. Red means I’m still talking, yellow means I’m still thinking, and green means it’s your turn! When you’re ready, click the start button to begin.", "clip": "105", "emotion": "100" },
    { "text": "Hello! I’m excited to read with you today. Let’s quickly go over how we’ll communicate as we read: Click on any speech bubble you see to signal you’re ready for my question. After I ask, hold off on responding until my eyes turn green. If my eyes are red, I’m still speaking; yellow means I need more time to think; and green means it’s your chance to answer! Once you’re ready, just hit the start button.", "clip": "106", "emotion": "100" },
    { "text": "Hi there! Ready to explore with me today? Before we dive in, here’s how we’ll go through it together: When a speech bubble appears, click it to let me know you’re ready for me to ask you something. After I ask, wait for my eye color to turn green before responding. Red means I’m still talking, yellow means I’m still thinking, and green means go ahead and reply! Once you’re all set, just press the start button.", "clip": "107", "emotion": "100" },
    { "text": "Hey! I’m so excited to read through with you today. Here’s a quick rundown of how we’ll work through this: Whenever you see a speech bubble in the article, click on it so I know you’re ready for my question. Once I ask, hold off on responding until my eyes turn green. Red means I’m still talking, yellow means I’m thinking, and green means it’s your turn! When you’re all set, click the start button.", "clip": "108", "emotion": "100" },
    { "text": "Hi! I’m excited to go through with you today. Before we start, let me explain how we’ll handle things: Click on the speech bubble when you’re ready for me to ask you a question. After I ask, please wait for my eye color to turn green before responding. If my eyes are red, I’m still talking; yellow means I’m thinking; and green means it’s your chance to respond! Click the start button when you’re ready.", "clip": "109", "emotion": "100" },
    { "text": "Hey! I’m really excited to read with you today. Before we begin, here’s a refresher on how we’ll go through it: If you see a speech bubble, click it to let me know you’re ready for a question. Once I ask, please wait for my eye color to turn green before responding. If my eyes are red, it means I’m still talking; yellow means I’m thinking; and green means it’s your turn to respond! Click the start button when you’re ready.", "clip": "110", "emotion": "100" }
];

var intros = [
    { "text": "Awesome! You can start reading now. Whenever you come across a speech bubble, click on it, and I’ll ask you a question. Just remember to wait until my eyes are green before answering. Enjoy reading!", "clip": "201", "emotion": "100" },
    { "text": "Great job! Start reading whenever you’re ready. When you see a speech bubble, click on it, and I’ll ask you something. Be sure to wait until my eyes turn green before responding. Happy reading!", "clip": "202", "emotion": "100" },
    { "text": "All set! Begin reading the article. When you find a speech bubble, click on it and I’ll ask you a question. Don’t forget—only answer when my eyes are green! Have fun reading!", "clip": "203", "emotion": "100" },
    { "text": "You’re ready to go! Start reading the article, and click on any speech bubble you find. I’ll ask you a question then, but wait until my eyes turn green before you answer. Enjoy!", "clip": "204", "emotion": "100" },
    { "text": "Awesome, go ahead and start reading. Click the speech bubble when you find one, and I’ll have a question for you. Just make sure to wait until my eyes are green before you respond. Enjoy the article!", "clip": "205", "emotion": "100" },
    { "text": "Great, you’re all set! Begin reading now. When you see a speech bubble, click it, and I’ll ask you something. Remember, only answer when my eyes turn green! Have a good read!", "clip": "206", "emotion": "100" },
    { "text": "You’re good to go! Start reading the article. Whenever you spot a speech bubble, click on it, and I’ll ask you a question. Just hold off until my eyes are green before responding. Happy reading!", "clip": "207", "emotion": "100" },
    { "text": "Go ahead and dive into the article! When you find a speech bubble, click it, and I’ll ask you a question. Be sure to wait for my eyes to turn green before you answer. Enjoy the read!", "clip": "208", "emotion": "100" },
    { "text": "Great! Start reading whenever you’re ready. Click on a speech bubble when you see one, and I’ll ask you a question. Just wait for my eyes to turn green before you respond. Have fun reading!", "clip": "209", "emotion": "100" },
    { "text": "Perfect! Go ahead and start reading now. When you come across a speech bubble, click on it, and I’ll ask you a question. Make sure to wait until my eyes are green before answering. Enjoy the article!", "clip": "210", "emotion": "100" }
];

var outros = [
    { "text": "Awesome! You’ve finished the reading, and I really enjoyed our discussion. I loved hearing your thoughts, and I’m looking forward to chatting again next time. Goodbye for now, see you soon!", "clip": "301", "emotion": "100" },
    { "text": "Great job! You’ve completed the reading, and I had a wonderful time talking with you. I really enjoyed hearing your ideas, and I can’t wait to chat again next time. Bye for now, and see you soon!", "clip": "302", "emotion": "100" },
    { "text": "Well done! The reading is finished, and our discussion was so much fun. I loved hearing your thoughts, and I’m excited for our next conversation. Goodbye for now, and see you soon!", "clip": "303", "emotion": "100" },
    { "text": "Nice work! You’ve wrapped up the reading, and I really enjoyed chatting with you. It was great hearing your thoughts, and I’m looking forward to our next discussion. See you soon, goodbye!", "clip": "304", "emotion": "100" },
    { "text": "Fantastic! You’ve finished reading, and it was a pleasure talking with you. I really enjoyed hearing your ideas, and I’m excited for next time. Goodbye, and I’ll see you soon!", "clip": "305", "emotion": "100" },
    { "text": "Great! The reading is done, and I had such a nice conversation with you. It was fun hearing your thoughts, and I’m looking forward to our next chat. See you soon, goodbye!", "clip": "306", "emotion": "100" },
    { "text": "Nice job! You’ve completed the reading, and I really enjoyed our discussion. I loved hearing your ideas, and I can’t wait to chat with you again soon. Goodbye for now!", "clip": "307", "emotion": "100" },
    { "text": "Well done! The reading is finished, and I had a great time talking with you. I really enjoyed hearing your thoughts, and I’m already looking forward to next time. Goodbye, and see you soon!", "clip": "308", "emotion": "100" },
    { "text": "Awesome! You’ve wrapped up the reading, and I truly enjoyed our conversation. I loved hearing your ideas, and I can’t wait to chat with you again. Goodbye for now, and see you soon!", "clip": "309", "emotion": "100" },
    { "text": "Great work! You’ve completed the reading, and I really enjoyed hearing your thoughts. It was such a fun discussion, and I’m excited for our next chat. See you soon, goodbye!", "clip": "310", "emotion": "100" }
];

var articleLibrary = [{
        'title': 'Meet the Microbes',
        'filename': 'meet_the_microbes'
    },
    {
        'title': 'Menacing Meningitis',
        'filename': 'menacing_meningitis'
    },
    {
        'title': 'Human Blood',
        'filename': 'human_blood'
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
        'filename': 'cold_nose_article'
    },
    {
        'title': 'Exoplanet Article',
        'filename': 'exoplanet_article'
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

function getArticleIndexByStudentId(studentId) {
    // Find the student by ID
    const student = studentsList.find(s => s.id === studentId);
    if (!student) {
        return -1; // student not found
    }
    // Get the current article title
    const currentTitle = student.current;
    // Find the index of the article with the matching title
    const articleIndex = articleLibrary.findIndex(article => article.title === currentTitle);
    return articleIndex; // returns -1 if not found
}

function getCurrentArticleByStudentId(studentId) {
    // Find the student by ID
    const student = studentsList.find(s => s.id === studentId);
    if (!student) {
        return -1; // student not found
    }
    // Get the current article title
    const currentTitle = student.current;
    return currentTitle;
}