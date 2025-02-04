(function($) {
    // @TODO replace with server url in production
    var SERVER_URL = "http://localhost:8000";
    var a1, a2, a3, b1, b2, b3, c1, c2, c3;
    a1 = b2 = c3 = [3, 6, 9, 13, 16, 21, 22, 23, 28, 30];
    a2 = b1 = c2 = [2, 4, 6, 9, 12, 20, 21, 22, 29];
    a3 = b3 = c1 = [3, 6, 9, 22, 23, 28, 30];
    var commentPinCount = 1;
    var redactPinCount = 1;
    var pagesOffsetTop = $("#editor-body").offset().top;
    var pagesOffsetLeft = $("#editor-body").offset().left;
    var scrolledDistance = 0;
    var emotionsList = [
        "anger",
        "anticipation",
        "disgust",
        "fear",
        "joy",
        "sadness",
        "surprise",
        "trust",
        "neutral",
    ];
    var typeList = ["custom", "summary", "vocab", "personal", "emotional"];
    var pins = [];
    var redactors = [];
    var meta = {};
    var loginGroup = "";
    window.pathArticleTitle = $("#assignment-title").text().trim();
    var selectedText = "";
    var commentsGroup = "all";
    // flori: variables start point -------
    var typePanel = [{
            type: "custom",
            count: 0,
            show: true,
            width: 0,
        },
        {
            type: "student-summary",
            count: 0,
            show: true,
            width: 0,
        },
        {
            type: "vocab-support",
            count: 0,
            show: true,
            width: 0,
        },
        {
            type: "personal-connection",
            count: 0,
            show: true,
            width: 0,
        },
        {
            type: "emotional-connection",
            count: 0,
            show: true,
            width: 0,
        },
    ];
    var emotionsPanel = [{
            id: "emoji-anger",
            count: 0,
            emote: "anger",
            show: true,
        },
        {
            id: "emoji-anticipation",
            count: 0,
            emote: "anticipation",
            show: true,
        },
        {
            id: "emoji-disgust",
            count: 0,
            emote: "disgust",
            show: true,
        },
        {
            id: "emoji-fear",
            count: 0,
            emote: "fear",
            show: true,
        },
        {
            id: "emoji-joy",
            count: 0,
            emote: "joy",
            show: true,
        },
        {
            id: "emoji-sadness",
            count: 0,
            emote: "sadness",
            show: true,
        },
        {
            id: "emoji-surprise",
            count: 0,
            emote: "surprise",
            show: true,
        },
        {
            id: "emoji-trust",
            count: 0,
            emote: "trust",
            show: true,
        },
        {
            id: "emoji-neutral",
            count: 0,
            emote: "neutral",
            show: true,
        },
    ];
    // flori: variables end point -------
    var quickComments = [{
            // comment library
            group: "student-summary",
            id: 1,
            desc: "Summary",
            show_items: 1,
            comments: [{
                    text: `I'm a little confused, can you explain that to me?`,
                    emotion: "anticipation",
                },
                {
                    text: `I THINK I understood, but could you summarize what that means for me?`,
                    emotion: "anticipation",
                },
                {
                    text: `How would you explain this to someone else in class?`,
                    emotion: "anticipation",
                },
                {
                    text: `So in other words, ______ _______`,
                    emotion: "joy",
                },
                {
                    text: `I can think of a couple more examples, such as ______ and _____`,
                    emotion: "joy",
                },
                {
                    text: `This reminds me of that class activity we did, where we _______`,
                    emotion: "surprise",
                },
            ],
        },
        {
            group: "vocab-support",
            id: 2,
            desc: "Vocabulary Support",
            show_items: 1,
            comments: [{
                    text: `Hoooold on. Can you tell me what  ______ means?`,
                    emotion: "anticipation",
                },
                {
                    text: `Huh? What do you think they mean when they say ____?`,
                    emotion: "anticipation",
                },
                {
                    text: `I've heard ____ before, I think it means ______.`,
                    emotion: "joy",
                },
                {
                    text: `I think when they're saying ____ it means ______.`,
                    emotion: "joy",
                },
            ],
        },
        {
            group: "personal-connection",
            id: 3,
            desc: "Personal Connection",
            show_items: 1,
            comments: [{
                    text: `Is there something in your home that works this way?`,
                    emotion: "anticipation",
                },
                {
                    text: `How do you think this might inform someone doing sports?`,
                    emotion: "anticipation",
                },
                {
                    text: `Knowing this, would you change how you go about your day?`,
                    emotion: "anticipation",
                },
                {
                    text: `Do you think this is something robots like me should know?`,
                    emotion: "joy",
                },
            ],
        },
        {
            group: "emotional-connection",
            id: 4,
            desc: "Emotional Connection",
            show_items: 1,
            comments: [{
                    text: `That's so surpising to me!`,
                    emotion: "surprise",
                },
                {
                    text: `I think this is probably the key bit for us to understand!`,
                    emotion: "anticipation",
                },
                {
                    text: `This would be a lot of fun to do in class!`,
                    emotion: "joy",
                },
                {
                    text: `Can you imagine how that feels?`,
                    emotion: "anticipation",
                },
                {
                    text: `Woah! That's so cool`,
                    emotion: "surprised",
                },
            ],
        },
        //, {
        //     'group': 'expand-predict',
        // 'id': 4,
        //     'desc': 'Expand Predict',
        //     'show_items': 1,
        //     'comments': [{
        //             'text': `Can you think of a couple of other examples of this?`,
        //             'emotion': 'Questioning'
        //         },
        //         {
        //             'text': `Wow! That sounds incredible, do you think its always true?`,
        //             'emotion': 'Surprised'
        //         },
        //         {
        //             'text': `That's interesting, what do you think would happen next?`,
        //             'emotion': 'Surprised'
        //         },
        //         {
        //             'text': `Not only that, but I also know that _________`,
        //             'emotion': 'Default'
        //         },
        //         {
        //             'text': `Another example of this would be _______`,
        //             'emotion': 'Attentive'
        //         },
        //         {
        //             'text': `I have also learned that ______`,
        //             'emotion': 'Happy'
        //         }
        //     ]
        // },
        // {
        //     'group': 'recalling-past-events',
        // 'id': 5,
        //     'desc': 'Recalling Past Events',
        //     'show_items': 1,
        //     'comments': [{
        //             'text': `I remember there was something like that in class - do you remember what it was?`,
        //             'emotion': 'Questioning'
        //         },
        //         {
        //             'text': `Do you remember something we did in class like this?`,
        //             'emotion': 'Surprised'
        //         },
        //         {
        //             'text': `Is this something you'd enjoy doing in class? I would!`,
        //             'emotion': 'Happy'
        //         },
        //         {
        //             'text': `Hmmm. Do you remember reading something about this in class?`,
        //             'emotion': 'Questioning'
        //         }
        //     ]
        // }
    ];

    $(document).ready(function() {
        preInit();
        init();
        $(document).on("click", ".comments-list-toggle", function() {
            $("main").attr("data-comments-toggle", "0");
            $("#comments-column-toggler").attr("data-toggler", "0");
        });
        $(document).on("click", ".comments-template-toggle", function() {
            $("main").attr("data-comments-toggle", "1");
            $("#comments-column-toggler").attr("data-toggler", "1");
        });
        $(document).on("click", "#audiences>p", function() {
            if ($(this).parent().attr("data-toggler") == "0") {
                $(this).parent().attr("data-toggler", "1");
            }
        });
        $(document).on("click", ".audience-class li", function() {
            $(".audience-class li").removeClass("selected");
            $(this).addClass("selected");
            var classID = $(this).attr("data-id").trim();
            var groupID = $(this).parents("#audiences").attr("data-group").trim();
            $(this).parents("#audiences").attr("data-class", classID);
            updateStudents(classID, groupID);
        });
        $(document).on("click", ".audience-groups li", function() {
            $("#audiences>p>span").text($(this).text().trim());
            $(".audience-groups li").removeClass("active");
            $(this).addClass("active");
            var classID = $(this).parents("#audiences").attr("data-class").trim();
            var groupID = $(this).attr("data-id").trim();
            $(this).parents("#audiences").attr("data-group", groupID);
            updateStudents(classID, groupID);
        });
        $(document).on("click", ".audience-students li", function() {
            $(this).toggleClass("selected");
        });
        $(document).on("click", function(e) {
            var container = $("#audiences");
            if (!$(e.target).closest(container).length) {
                $("#audiences").attr("data-toggler", "0");
            }
        });
        $(document).on("click", ".add-comment-btn", function() {
            if ($("main").attr("data-comments") == "0") {
                $("main").attr("data-comments", "1");
            } else {
                $("main").attr("data-comments", 0);
            }
        });
        $(document).on("click", "#selected-emotion>p", function() {
            if ($(this).parent().attr("data-toggler") == "0") {
                $(this).parent().attr("data-toggler", "1");
            } else {
                $(this).parent().attr("data-toggler", "0");
            }
        });
        $(document).on("click", "#selected-emotion > ul li", function() {
            var $this = $(this);
            var emotionId = getEmotionId($(this).text().trim());
            $("#selected-emotion > ul li").removeClass("active");
            $this.addClass("active");
            $this.parents("#selected-emotion").children("p").text($(this).text().trim());
            $this.parents("#selected-emotion").attr("data-toggler", "0");
            if (emotionId !== "") {
                // console.log("valid emotion selected, resetting")
                $this.parents("#robot-emotions").attr("class", "blink");
                setTimeout(function() {
                    $this.parents("#robot-emotions").attr("class", $this.text().trim().toLowerCase());
                }, 150);
            }
            if ($(".cp.focused").length == 1) {
                $(".cp#" + $(".cp.focused").attr("id")).attr("data-emotion", emotionId);
                $('#comments-list [data-id="' + $(".cp.focused").attr("id") + '"]').attr("data-emotion", emotionId);
                managePin($(".cp.focused").attr("id"), "updateEmotion", emotionId);
                // flori: add blue background to active comment id
                $('#comments-list ul li[data-id="' + $(".cp.focused").attr("id") + '"]').find(".comment-id").addClass("active");
            }
            // flori: update emotions panel and sort
            updateEmotionsPanel();
            checkSortOption();
        });
        // flori: open/close bottom panel on click
        $("#bottom-panel-type-bar").on("click", function(e) {
            e.stopPropagation();
            $(this).toggleClass("active");
        });
        $(document).on("click", function() {
            $("#bottom-panel-type-bar").removeClass("active");
        });
        $(".hide-type").on("click", function(e) {
            e.stopPropagation();
        });
        $(".hide-bottom-panel-text").on("click", sortTypeAndEmotions);
        //  flori: toggle active class for each type bar text
        $(document).on("click", ".hide-bottom-panel-text", function() {
            $(this).toggleClass("active");
        });
        //  flori: toggle active class for each emoji
        $(document).on("click", ".emoji", sortTypeAndEmotions);
        $(document).on("click", "#user-profile", function(e) {
            $(this).toggleClass("active");
        });
        $(document).on("click", "#user-profile-menu > ul > li", function() {
            $("#user-profile").removeClass("active");
        });
        // flori: end code snippet

        $("#editor").scroll(function() {
            scrolledDistance = parseInt($("#editor").scrollTop());
        });
        $(document).on("dragover", "#pages", function(e) {
            e.preventDefault();
        });
        $(document).on("dragstart", ".cn, .ce, .cp, .re, .rp", function(e) {
            if ($(this).hasClass("cp") || $(this).hasClass("rp")) {
                var srcTop =
                    e.originalEvent.clientY - pagesOffsetTop + scrolledDistance;
                var srcLeft = e.originalEvent.clientX - pagesOffsetLeft;
                var diffY = srcTop - parseInt($(this).css("top"), 10);
                var diffX = srcLeft - parseInt($(this).css("left"), 10);
                e.originalEvent.dataTransfer.setData("text/plain", diffY + "-" + diffX);
            }
            e.originalEvent.dataTransfer.setData("text/html", e.target.outerHTML);
            // flori: update sort
            checkSortOption();
        });
        $(document).on("drop", "#pages", function(e) {
            e.preventDefault();
            // console.log("pin dropped!")
            //init();
            var elem = $.parseHTML(e.originalEvent.dataTransfer.getData("text/html"))[0];
            var posTop = e.originalEvent.clientY - pagesOffsetTop + scrolledDistance;
            var posLeft = e.originalEvent.clientX - pagesOffsetLeft;
            var cText = $(elem).text().trim();
            // flori: added new var cType
            var cType = $(elem).attr("data-type");
            var cEmotion = $(elem).attr("data-emotion");
            var editorWidth = $("#editor").width();
            var diffY = 0;
            var diffX = 0;
            if ($(elem).hasClass("cn")) {
                cText = "";
            }
            if ($(elem).hasClass("cp") || $(elem).hasClass("rp")) {
                diffY = e.originalEvent.dataTransfer.getData("text/plain").split("-")[0];
                diffX = e.originalEvent.dataTransfer.getData("text/plain").split("-")[1];
            }
            if ($(elem).hasClass("cp")) {
                var cID = $(elem).attr("id").trim();
                $(document).find(".cp#" + cID).css("top", posTop - diffY);
                $(document).find(".cp#" + cID).css("left", posLeft - diffX);
                $(document).find('#comments-list>ul[data-id="' + cID + '"]').attr("data-top", posTop - diffY);
                $(document).find('#comments-list>ul[data-id="' + cID + '"]').attr("data-left", posLeft - diffX);
                if (posLeft + 160 >= editorWidth) {
                    $(document).find(".cp#" + cID).addClass("edged");
                } else {
                    $(document).find(".cp#" + cID).removeClass("edged");
                }
                $(document).find(".cp#" + cID + ">p").click();
                sortComments(cID);
                // flori: update sort (so order doesnt change when dragging bubble on editor)
                checkSortOption();
            }

            if ($(elem).hasClass("cn") || $(elem).hasClass("ce")) {
                $("#pages").append(
                    '<div data-type="' +
                    cType +
                    '" data-emotion="' +
                    cEmotion +
                    '" data-comment="' +
                    cText +
                    '" id="c' +
                    commentPinCount +
                    '" class="cp" draggable="true" style="top:' +
                    posTop +
                    "px; left:" +
                    posLeft +
                    'px;"><p></p><ul><li class="delete-pin">Delete</li><li class="duplicate-pin">Duplicate</li><li class="new-pin">Create New</li></ul></div>'
                );
                $(document)
                    .find(".cp#c" + commentPinCount + ">p")
                    .click();
                $("#comments-list>ul").append(
                    '<li data-top="' +
                    posTop +
                    '" data-left="' +
                    posLeft +
                    '" data-comment="' +
                    cText +
                    '"data-type="' +
                    cType +
                    '" data-emotion="' +
                    cEmotion +
                    '" data-id="c' +
                    commentPinCount +
                    '"><div class="comment-container"><span class="comment-id">' +
                    commentPinCount +
                    '</span><div class="existing-comment-elements"></div><div class="comment-text"><p>' +
                    cText +
                    " </p></div></div></div></li>"
                );
                sortComments("c" + commentPinCount);
                // flori: update total comment count and typebar
                commentPinCount++;
                typeBar();
                $("#bottom-panel-title").text("Comments: " + (commentPinCount - 1));
                // flori: updates sort for existing comments
                checkSortOption();

                if ($(elem).hasClass("cn")) {
                    $("#comment-input textarea").attr(
                        "placeholder",
                        "[Create your own comment]"
                    );
                }
                // This always crashes: Anis fixed a few issues like added data-type for ai comments
                if ($(elem).hasClass("ce")) {
                    var groupName = $(elem).attr("data-parent").trim();
                    if (!$(elem).hasClass("cai")) {
                        var currentCommentId = $(elem).attr("data-id").trim();
                    }
                    var latestCommentId = $(
                            '#comments-template [data-group="' + groupName + '"]'
                        )
                        .attr("data-latest")
                        .trim();
                    $(document)
                        .find(
                            '#comments-template [data-id="' +
                            currentCommentId +
                            '"][data-parent="' +
                            groupName +
                            '"]'
                        )
                        .remove();
                    getNextComment(groupName, latestCommentId);
                }
                if (posLeft + 160 >= editorWidth) {
                    $(document)
                        .find(".cp#c" + (commentPinCount - 1))
                        .addClass("edged");
                } else {
                    $(document)
                        .find(".cp#c" + (commentPinCount - 1))
                        .removeClass("edged");
                }
                // flori: add custom comment title to custom comment
                addCustomDropdown();
                // flori: update emotions and type panel
                typeBar();
                updateEmotionsPanel();
            }

            if ($(elem).hasClass("re")) {
                $("#pages").append(
                    '<div id="r' +
                    redactPinCount +
                    '" class="rp" draggable="true" style="top:' +
                    posTop +
                    "px; left:" +
                    posLeft +
                    'px;"><ul><li class="delete-redactor">Delete</li><li class="duplicate-redactor">Duplicate</li></ul></div>'
                );
                redactPinCount++;
            }
            if ($(elem).hasClass("rp")) {
                var rID = $(elem).attr("id").trim();
                $(document)
                    .find(".rp#" + rID)
                    .css("top", posTop - diffY);
                $(document)
                    .find(".rp#" + rID)
                    .css("left", posLeft - diffX);
            }
        });
        $(document).on("drop", "#comment-input textarea", function(e) {
            e.preventDefault();
        });
        $(document).on("click", ".cp>p", function() {
            var $this = $(this).parent();
            $("#comments-list ul li").each(function() {
                $(this).find(".comment-id").removeClass("active");
            });
            $(".cp").removeClass("focused");
            $($this).addClass("focused");
            // flori: add blue background to active comment id
            $('#comments-list ul li[data-id="' + $this.attr("id") + '"]').find(".comment-id").addClass("active");
            $(document).find('#selected-emotion > ul li[data-id="' + $($this).attr("data-emotion").trim() + '"]').click();
            $("#comment-input textarea").val($($this).attr("data-comment").trim());
            if ($($this).attr("data-comment").trim() == "") {
                $("#comment-input[data-play]").removeAttr("data-play");
            } else {
                $("#comment-input").attr("data-play", 1);
            }
            // console.log('pin clicked')
            // Necessary to prevent multiple calls to fetchEmotion
            if ($($this).attr("data-emotion").trim() == "") {
                // console.log('pin does not have a valid emotion, refreshing')
                prevEmotQueryText = "";
                refreshEmotion();
            } else {
                // console.log('pin has a valid emotion, no need to refresh')
                prevEmotQueryText = $($this).attr("data-comment").trim();
            }
            $("#comment-input textarea").focus();
        });
        $(document).on("click", "#comments-list ul li", function() {
            $(document).find(".cp#" + $(this).attr("data-id") + ">p").click();
            $("#editor").animate({
                scrollTop: $("#editor").offset().top + parseInt($(".cp#" + $(this).attr("data-id")).css("top"), 10) - 200,
            });
            // 200 = 116(height from body top to pages/editor top is 116) + 84(scroll to 84px above the pin)
            // flori: add blue background to active comment pin
            $(this).find(".comment-id").addClass("active");
        });
        $(document).on("input", "#comment-input textarea", function() {
            if ($(".cp.focused").length == 1) {
                $(".cp#" + $(".cp.focused").attr("id")).attr("data-comment", $(this).val());
                $('#comments-list [data-id="' + $(".cp.focused").attr("id") + '"]').attr("data-comment", $(this).val());
                $('#comments-list [data-id="' + $(".cp.focused").attr("id") + '"] > p').text($(this).val());
                // flori: update custom comment text when typing in input area
                $('#comments-list [data-id="' + $(".cp.focused").attr("id") + '"] .comment-text > p').text($(this).val());
                managePin($(".cp.focused").attr("id"), "updateComment", $(this).val());
            }
            if ($(this).val().trim() == "") {
                $("#comment-input[data-play]").removeAttr("data-play");
            } else {
                $("#comment-input").attr("data-play", 1);
            }
        });
        $(document).on("click", "#group-name p", function() {
            $(this).parents("#group-name").toggleClass("active");
        });
        $(document).on("click", "#group-name li:not(.active)", function() {
            var $this = $(this);
            $("#group-name li").removeClass("active");
            $this.addClass("active");
            $("#group-name p span").text($this.text());
            $("#group-name p span").attr("data-group-id", $this.attr("data-group"));
            $this.parents("#group-name").toggleClass("active");
        });
        $(document).on("click", ".teacher-facing #article-menu p", function() {
            $(this).parents("#article-menu").toggleClass("active");
        });
        $(document).on("click", "#article-menu li:not(.active)", function() {
            var $this = $(this);
            $("#article-menu li").removeClass("active");
            $this.addClass("active");
            $("#article-menu p span").text($this.text());
            $this.parents("#article-menu").toggleClass("active");
            localStorage.setItem("currentArticle", $this.attr("data-article"));
            localStorage.setItem("currentArticleTitle", $this.text().trim());
            setTimeout(function() {
                location.reload();
            }, 500);
        });
        $(document).on("click", "#comments-category p", function() {
            $(this).parents("#comments-category").toggleClass("active");
        });
        $(document).on("click", "#comments-category li:not(.active)", function() {
            var $this = $(this);
            $("#comments-category li").removeClass("active");
            $this.addClass("active");
            $("#comments-category p").text($this.text());
            commentsGroup = $this.attr("data-group").trim().toLowerCase();
            $this.parents("#comments-category").toggleClass("active");
            setTimeout(function() {
                $(".refresh-btn").click();
            }, 100);
        });
        // flori: toggle active class for custom comment dropdown
        $(document).on("click", ".custom-comment-title p", function() {
            $(this).parents(".custom-comment-title").toggleClass("active");
        });
        // flori: add dropdown functions to custom comment
        $(document).on("click", ".custom-comment-title li:not(.active)", function() {
            var $this = $(this);
            var commentTitle = $this.closest(".custom-comment-title");
            var parentID = $this.closest("li[data-id]").attr("data-id");
            var dataTypeClicked = $this.attr("data-type");
            $(".custom-comment-title li").removeClass("active");
            $this.addClass("active");
            $this.closest("li[data-id]").filter('[data-id="' + parentID + '"]').find(".custom-comment-title > p").text($this.text());
            $this.closest("li[data-id]").filter('[data-id="' + parentID + '"]').attr("data-type", dataTypeClicked);
            $this.parents(".comment-container").attr("data-type", dataTypeClicked);
            commentTitle.attr("data-type", dataTypeClicked);
            $('div[id="' + parentID + '"]').attr("data-type", dataTypeClicked);
            commentTitle.toggleClass("active");
            typeBar();
        });
        // flori: toggle active class for sort-by dropdown
        $(document).on("click", "#sort-by p", function() {
            $(this).parents("#sort-by").toggleClass("active");
        });
        // flori: add dropdown functions to sort-by
        $(document).on("click", "#sort-by li:not(.active)", function() {
            var $this = $(this);
            $("#sort-by li").removeClass("active");
            $this.addClass("active");
            $("#sort-by p span").text($this.text());
            $this.parents("#sort-by").toggleClass("active");
            checkSortOption();
        });
        $(document).on("click", ".refresh-btn", function() {
            var $this = $(this);
            $this.addClass("active");
            $this.addClass("ai-active");
            if (selectedText == "") {
                $this.removeClass("ai-active");
                if (commentsGroup == "all") {
                    $.each($("#comments-template ul[data-group]"), function() {
                        var groupName = $(this).attr("data-group");
                        var latestCommentId = $(this).attr("data-latest");
                        setTimeout(function() {
                            $(document).find('#comments-template [data-parent="' + groupName + '"]').remove();
                            getNextComment(groupName, latestCommentId);
                            reorder();
                            $this.removeClass("active");
                        }, 1000);
                    });
                } else {
                    setTimeout(function() {
                        $("#comments-template > ul > .ce:not(.cai)").remove();
                        for (var i = 0; i < 3; i++) {
                            var latestCommentId = $('ul[data-group="' + commentsGroup + '"]').attr("data-latest");
                            getNextComment(commentsGroup, latestCommentId);
                        }
                        if (selectedText == "") {
                            $(".cai").remove();
                        }
                        reorder();
                        $this.removeClass("active");
                    }, 1000);
                }
            } else {
                var counter = 0;
                var counterVal = setInterval(function() {
                    ++counter;
                }, 1);
                //highlight(selectedText);
                //console.log("Sending Request");
                if (selectedText.length > 0) {
                    $.ajax(SERVER_URL + "/comment", {
                            data: JSON.stringify({ text: selectedText }),
                            type: "POST",
                            contentType: "application/json",
                        })
                        .done(function(data) {
                            console.log(data);
                            clearInterval(counterVal);
                            setTimeout(function() {
                                if (commentsGroup == "all") {
                                    $.each($("#comments-template ul[data-group]"), function() {
                                        var groupName = $(this).attr("data-group");
                                        var latestCommentId = $(this).attr("data-latest");
                                        $(document)
                                            .find(
                                                '#comments-template [data-parent="' + groupName + '"]'
                                            )
                                            .remove();
                                        getNextComment(groupName, latestCommentId);
                                    });
                                    reorder();
                                    $this.removeClass("active");
                                    $(".cai").remove();
                                    $.each($("#comments-template ul[data-group]"), function() {
                                        var groupName = $(this).attr("data-group");
                                        var groupId = $(this).attr("data-group-id");
                                        $(this).append(
                                            '<li class="ce cai" data-parent="' +
                                            groupName +
                                            '" draggable="true" data-type="' + groupId + '" data-emotion="">' +
                                            data[groupName] +
                                            "</li>"
                                        );
                                    });
                                } else {
                                    $("#comments-template > ul > .ce:not(.cai)").remove();
                                    for (var i = 0; i < 3; i++) {
                                        var latestCommentId = $(
                                            'ul[data-group="' + commentsGroup + '"]'
                                        ).attr("data-latest");
                                        getNextComment(commentsGroup, latestCommentId);
                                    }
                                    reorder();
                                    $this.removeClass("active");
                                    $(".cai").remove();
                                    $(
                                        '#comments-template ul[data-group="' + commentsGroup + '"]'
                                    ).append(
                                        '<li class="ce cai" data-parent="' +
                                        commentsGroup +
                                        '" draggable="true" data-type="' +
                                        $('#comments-template ul[data-group="' +
                                            commentsGroup +
                                            '"]').attr('data-group-id') +
                                        '" data-emotion="">' +
                                        data[commentsGroup] +
                                        "</li>"
                                    );
                                }
                                selectedText = "";
                                $this.removeClass("ai-active");
                            }, nearestThousand(counter) - counter);
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR["responseJSON"]);
                        });
                }
            }
        });
        $(document).on("click", ".refresh-ai-btn", function() {
            var $this = $(this);
            $this.addClass("active");
            setTimeout(function() {
                // geenrate comments
                // randomly order
                $this.removeClass("active");
            }, 1000);
        });
        $(document).on("click", ".delete-pin", function() {
            managePin($(this).parents(".cp").attr("id"), "delete");
            $(
                '#comments-list li[data-id="' + $(this).parents(".cp").attr("id") + '"]'
            ).remove();
            $(this).parents(".cp").remove();
            // flori: update total comment count
            commentPinCount--;
            $("#bottom-panel-title").text("Comments: " + (commentPinCount - 1));
            // flori: update type and emotions panel and sort
            typeBar();
            updateEmotionsPanel();
            checkSortOption();
        });
        $(document).on("click", ".duplicate-pin, .new-pin", function() {
            var target = $(document).find(".cp#" + $(this).parents(".cp").attr("id"));
            var posTop = parseInt(target.css("top"), 10);
            var posLeft = parseInt(target.css("left"), 10);
            var cType = target.attr("data-type");
            var cText = target.attr("data-comment");
            var cEmotion = target.attr("data-emotion");
            var editorHeieght = $("#editor").height();
            if ($(this).hasClass("new-pin")) {
                cText = "";
                // flori: edit* set default new emotion to neutral and added cType = 0
                cEmotion = 8;
                cType = 0;
            }
            if (posTop + 50 >= editorHeieght) {
                posTop -= 50;
            } else {
                posTop += 50;
            }
            $("#pages").append(
                '<div data-type="' +
                cType +
                '" data-emotion="' +
                cEmotion +
                '" data-comment="' +
                cText +
                '" id="c' +
                commentPinCount +
                '" class="cp" draggable="true" style="top:' +
                posTop +
                "px; left:" +
                posLeft +
                'px;"><p></p><ul><li class="delete-pin">Delete</li><li class="duplicate-pin">Duplicate</li><li class="new-pin">Create New</li></ul></div>'
            );
            $(document)
                .find(".cp#c" + commentPinCount + ">p")
                .click();
            // flori: edit* append the comment bubble with updated html when duplicate/add new pin
            $("#comments-list>ul").append(
                '<li data-top="' +
                posTop +
                '" data-left="' +
                posLeft +
                '" data-comment="' +
                cText +
                '"data-type="' +
                cType +
                '" data-emotion="' +
                cEmotion +
                '" data-id="c' +
                commentPinCount +
                '"><div class="comment-container"><span class="comment-id">' +
                commentPinCount +
                '</span><div class="existing-comment-elements"></div><div class="comment-text"><p>' +
                cText +
                " </p></div></div></div></li>"
            );
            sortComments("c" + commentPinCount);
            // flori: update total comment count
            commentPinCount++;
            $("#bottom-panel-title").text("Comments: " + (commentPinCount - 1));
            // flori: update type and emotions panel and apply custom dropdown menu and sort
            addCustomDropdown();
            typeBar();
            updateEmotionsPanel();
            checkSortOption();
        });
        $(document).on("click", ".delete-redactor", function() {
            $(this).parents(".rp").remove();
        });
        $(document).on("click", ".duplicate-redactor", function() {
            var target = $(document).find(".rp#" + $(this).parents(".rp").attr("id"));
            var posTop = parseInt(target.css("top"), 10);
            var posLeft = parseInt(target.css("left"), 10);
            var editorHeieght = $("#editor").height();
            if (posTop + 110 >= editorHeieght) {
                posTop -= 110;
            } else {
                posTop += 110;
            }
            $("#pages").append(
                '<div id="r' +
                redactPinCount +
                '" class="rp" draggable="true" style="top:' +
                posTop +
                "px; left:" +
                posLeft +
                'px;"><ul><li class="delete-redactor">Delete</li><li class="duplicate-redactor">Duplicate</li><li class="duplicate-redactor">Duplicate</li></ul></div>'
            );
            redactPinCount++;
        });
        $(document).on("click", '#comment-input[data-play="1"] #play', function() {
            say($(this).parent().children("textarea").val().trim());
        });

        // $('#emotion-button').on('click', function() {
        //     comment_text = $('#comment-input textarea').val().trim()
        //     $('#emotion-button').prop("disabled",true);
        //     $('#emotion-button').addClass("disabled-button");
        //     $.ajax(SERVER_URL + '/emotion', {
        //         'data': JSON.stringify({ text: comment_text }),
        //         'type': 'POST',
        //         'contentType': 'application/json'
        //     }).done(function(data) {
        //         var emotions = data['emotion_classes']
        //         if (emotions.length == 0){
        //             alert("No emotion labeled");
        //         }
        //         console.log(emotions)
        //         var emotions = emotions.map(function(emot){
        //             return `[${emot}]`
        //         })
        //         console.log(emotions)
        //         var emotions_text = emotions.join(' ')
        //         console.log(emotions_text)
        //         $('#comment-input textarea').val(comment_text + ' ' + emotions_text)

        //     }).fail(function(jqXHR, textStatus, errorThrown){
        //         console.log(jqXHR['responseJSON'])
        //     }).always(function(){
        //         $('#emotion-button').prop("disabled", false);
        //         $('#emotion-button').removeClass("disabled-button");
        //     });
        // });
        $(document).on("input", "#group-password", function() {
            $("#login-error").remove();
        });
        $(document).on("click", "#login", function() {
            var flag = true;
            $.each(groups, function(i, v) {
                if (v.id == $("#group-name > p > span").attr("data-group-id").trim()) {
                    if (v.password == $("#group-password").val()) {
                        localStorage.setItem("auth", v.id);
                        localStorage.setItem("auth-name", v.name);
                        articleList = v.articles;
                        localStorage.setItem("currentArticle", articleList[0].filename);
                        localStorage.setItem("currentArticleTitle", articleList[0].title);
                        flag = false;
                    }
                }
            });
            if (flag) {
                if ($("#login-error").length == 0) {
                    $("#splash > div:not(.brand)").append(
                        "<div id='login-error'>The login credentials don't match. Please try again.</div>"
                    );
                }
            } else {
                location.reload();
            }
        });
        $(document).on("click", "#guest-login", function() {
            localStorage.setItem("auth", "guest");
            articleList = articles;
            localStorage.setItem("currentArticle", articleList[0].filename);
            localStorage.setItem("currentArticleTitle", articleList[0].title);
            location.reload();
        });
        $(document).on("click", "#logout", function() {
            localStorage.setItem("auth", "true");
            location.reload();
        });
        $(document).on("click", "#resume", function() {
            recreateCanvas();
            $(this).addClass("temporary-hidden");
        });
        $(document).on("click", "#save-btn", function() {
            var url = "/validate/",
                data = {};
            save();
            data.pins = JSON.stringify(pins);
            data.redactors = JSON.stringify(redactors);
            data.meta = JSON.stringify(meta);
            data.uid = window.pathSessionId;
            data.group = loginGroup;
            data.article = $("#assignment-title").text().trim();
            if (pins.length > 0) {
                // submitToGoogleForm(JSON.stringify(pins), JSON.stringify(redactors), JSON.stringify(meta), window.pathSessionId, loginGroup);
                $.post(url, { 'save': data }, function(result, success) {
                    if (success == 'success') {
                        var response = result;
                        console.log(response);
                        console.log(data);
                    } else {
                        console.log('Something went wrong!');
                    }
                });
            } else {
                alert("No comments to save");
            }
        });
        $(document).on("mouseup keyup", "#editor-body", function() {
            // if ($('.highlight').length) {
            //     var target = $('.highlight').parent()[0];
            //     $('.highlight').contents().unwrap();
            //     target.normalize();
            // }
            if (typeof window.getSelection != "undefined") {
                selectedText = window.getSelection().toString();
            } else if (
                typeof document.selection != "undefined" &&
                document.selection.type == "Text"
            ) {
                selectedText = document.selection.createRange().text;
            } else {
                selectedText = "";
            }
        });
        $(window).resize(function() {
            $("#outerContainer").width($("#pages").width());
            setTimeout(function() {
                $("#pages").height($("#outerContainer #viewer").height());
            }, 500);
        });

        $("#comment-input textarea").on("focusout", function() {
            refreshEmotion();
        });
    });

    function recreateCanvas() {
        commentPinCount = 1;
        $("#comments-list > ul").empty();
        $("#pages div.cp").remove();
        var recreatePins = JSON.parse($("#pins-data").text().trim());
        $.each(recreatePins, function(i, v) {
            var pinId = Number(v.id.slice(1));
            if (pinId >= commentPinCount) {
                commentPinCount = pinId + 1;
            }
            $("#pages").append(
                `<div data-type="` +
                v.type +
                `" data-emotion="` +
                v.emotion +
                `" data-comment="` +
                v.text +
                `" id="c` +
                pinId +
                `" class="cp" draggable="true" style="top:` +
                v.top +
                `px; left:` +
                v.left +
                `px;"> <p>` +
                pinId +
                `</p>
                <ul>
                    <li class="delete-pin">Delete</li>
                    <li class="duplicate-pin">Duplicate</li>
                    <li class="new-pin">Create New</li>
                </ul>
            </div>
            `
            );
            $("#comments-list > ul").append(
                `
            <li data-type="` +
                v.type +
                `" data-top="` +
                v.top +
                `" data-left="` +
                v.left +
                `" data-comment="` +
                v.text +
                `" data-emotion="` +
                v.emotion +
                `" data-id="c` +
                pinId +
                `">
                <span class="comment-id">` +
                pinId +
                `</span>
                <p>` +
                v.text +
                `</p>
            </li>
            `
            );
        });
        setTimeout(function() {
            $(
                '#comments-list > ul > li[data-id="c' +
                (commentPinCount - 1).toString() +
                '"]'
            ).click();
        }, 150);
    }

    function reorder() {
        var a = [];
        var b = [];
        for (var i = 0; i < 4;) {
            a[i] = ++i;
        }
        for (var i = 0; i < 4;) {
            b[i] = ++i;
        }
        a = shuffle(a);
        b = shuffle(b);
        // console.log(a, b);
        for (var i = 2; i < 6; ++i) {
            $("#comments-category > ul > li:nth-child(" + i + ")").css(
                "order",
                a[i - 2]
            );
            $("#comments-template > ul:nth-child(" + i + ")").css("order", b[i - 2]);
        }
    }

    function shuffle(array) {
        var tmp,
            current,
            top = array.length;
        if (top)
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        return array;
    }

    function nearestThousand(n) {
        return Math.ceil(n / 1000) * 1000;
    }

    function highlight(text) {
        var inputText = document.getElementById("editor-body");
        var innerHTML = inputText.innerHTML;
        var index = innerHTML.indexOf(text);
        if (index >= 0) {
            innerHTML =
                innerHTML.substring(0, index) +
                "<span class='highlight'>" +
                innerHTML.substring(index, index + text.length) +
                "</span>" +
                innerHTML.substring(index + text.length);
            inputText.innerHTML = innerHTML;
        }
    }

    function submitToGoogleForm(pins, redactors, meta, uid, loginGroup) {
        // save comment pins with their related comments and emotions etc
        var formid = "e/1FAIpQLScKuIrXyra1lh8Xxt74vbJ9cRr2WfERS8Ho6aQdtSwyA80tYg";
        var data = {
            "entry.2032535083": pins,
            "entry.836476239": redactors,
            "entry.1793196186": meta,
            "entry.1469484922": uid,
            "entry.93229899": loginGroup,
        };
        var params = [];
        for (key in data) {
            params.push(key + "=" + encodeURIComponent(data[key]));
        }
        // Submit the form using an image to avoid CORS warnings.
        new Image().src =
            "https://docs.google.com/forms/d/" +
            formid +
            "/formResponse?" +
            params.join("&");
    }

    function preInit() {
        // initializes all the default htmls from json objs
        var elem = "";
        if (localStorage.getItem("auth") == "true") {
            $("#splash").removeClass("hide");
            $.each(groups, function(i, v) {
                $("#group-name>ul").append(
                    "<li" +
                    (i == 0 ? ' class="active"' : "") +
                    ' data-group="' +
                    v.id +
                    '">' +
                    v.name +
                    "</li>"
                );
            });
            $("#group-name p span").text(groups[0].name);
            $("#group-name p span").attr("data-group-id", groups[0].id);
        } else if (localStorage.getItem("auth") == "guest") {
            $("#splash").addClass("hide");
        } else {
            $("#logged-user > span").text(localStorage.getItem("auth-name").trim());
            $("#splash").addClass("hide");
            var fetchUrl = "/validate/",
                fetchData = {};
            fetchData.group = localStorage.getItem("auth").trim();
            fetchData.article = localStorage.getItem("currentArticleTitle").trim();
            $.post(fetchUrl, { 'fetch': fetchData }, function(result, success) {
                if (success == 'success') {
                    var response = JSON.parse(result);
                    if (response.status) {
                        //$('#resume').removeClass('temporary-hidden');
                        $('#pins-data').text(response.pins);
                    }
                } else {
                    console.log('Something went wrong from fetching the latest data!');
                }
            });
        }
        $.each(articleList, function(i, v) {
            $("#article-menu>ul").append(
                "<li" +
                (localStorage.getItem("currentArticle") == v.filename ?
                    ' class="active"' :
                    "") +
                ' data-article="' +
                v.filename +
                '">' +
                v.title +
                "</li>"
            );
        });
        $(".teacher-facing #article-menu p span").text(localStorage.getItem("currentArticleTitle"));
        $(".student-robot-facing #article-menu p span").text(localStorage.getItem("currentArticleTitle"));
        $("#assignment-title").text(localStorage.getItem("currentArticleTitle"));
        window.pathArticleTitle = localStorage.getItem("currentArticleTitle");
        $.each(emotionsList, function(i, v) {
            $("#selected-emotion>ul").append(
                "<li" +
                (i == 0 ? ' class="active"' : "") +
                ' data-id="' +
                i +
                '">' +
                v +
                "</li>"
            );
        });
        $.each(quickComments, function(i, v) {
            elem += '<ul data-group-id="' + v.id + '" data-group="' + v.group + '" data-latest="0">';
            var counter = 0;
            $.each(v.comments, function(ci, cv) {
                if (counter < v.show_items) {
                    elem +=
                        '<li class="ce" data-id="' +
                        ci +
                        '" data-parent="' +
                        v.group +
                        '" draggable="true" data-type="' +
                        v.id +
                        '" data-emotion="' +
                        getEmotionId(cv.emotion) +
                        '">' +
                        cv.text +
                        "</li>";
                    counter++;
                } else {
                    return false;
                }
            });
            elem += "</ul>";
            $("#comments-category ul").append(
                '<li data-group="' + v.group + '">' + v.desc + "</li>"
            );
        });
        if (quickComments.length > 0 && elem !== "") {
            $("#comments-template").append(elem);
        }
        // get the rendered pdf inside the editor area
        $("#outerContainer").width($("#pages").width());
        setTimeout(function() {
            $("#pages").append($("#outerContainer"));
        }, 300);
        setTimeout(function() {
            $("#pages").height($("#outerContainer #viewer").height());
        }, 1000);
    }

    function init() {
        // initializes all the default values for auto genrated lists like comments library, emotions list, students etc
        $(".audience-groups li:first-child").click();
        $(".audience-class > ul li:first-child").click();
        $("#audiences").attr("data-toggler", "0");
        $(document).find("#selected-emotion > ul li:nth-child(2)").click();
        $("#selected-emotion").attr("data-toggler", "0");
        $("#comment-input textarea").val("");
        $("#comment-input[data-play]").removeAttr("data-play");
    }

    function say(m) {
        // create and play audio demos for comments to create
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[1];
        msg.voiceURI = "native";
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1.4;
        msg.text = m;
        msg.lang = "en-US";
        speechSynthesis.speak(msg);
    }

    function managePin(id, action, value) {
        // update contents: messages, pin number, emotion etc for each selected comment pins
        $.each(pins, function(i, v) {
            if (v.id == id) {
                if (action == "updateComment") {
                    v.text = value;
                }
                if (action == "updateEmotion") {
                    v.emotion = value;
                }
                if (action == "delete") {
                    pins.splice(i, 1);
                }
                return false;
            }
        });
    }

    function getEmotionId(emotion) {
        // returns the order of the emotion in the json obj of emotions
        var id = "";
        $.each(emotionsList, function(i, v) {
            if (emotion == v) {
                id = i;
            }
        });
        return id;
    }

    // Aadya's Code: Start
    function getTypeId(type) { // returns the order of the type in the json obj of types
        var id = 0;
        $.each(typeList, function(i, v) {
            if (type == v) {
                id = i;
            }
        });
        return id;
    }
    // Aadya's Code: End

    function getNextComment(groupName, latestCommentId) {
        // return the next available comment from a comment group to replace the comment template that has just been dragged onto the editor from the sidebar
        $.each(quickComments, function(i, v) {
            if (v.group.trim() == groupName.trim()) {
                latestCommentId++;
                if (latestCommentId >= v.comments.length) {
                    latestCommentId = 0;
                }
                var cv = v.comments[latestCommentId];
                $('#comments-template [data-group="' + groupName + '"]').append(
                    '<li class="ce" data-id="' +
                    latestCommentId +
                    '" data-parent="' +
                    v.group +
                    '" draggable="true" data-type="' +
                    v.id +
                    '" data-emotion="' +
                    getEmotionId(cv.emotion) +
                    '">' +
                    cv.text +
                    "</li>"
                );
                $('#comments-template [data-group="' + groupName + '"]').attr(
                    "data-latest",
                    latestCommentId
                );
            }
        });
    }

    function sortComments(id) {
        // updates the order of the newly created pin comments in the sidebar as per their position in the editor
        var length = $("#comments-list>ul>li").length;
        if (length > 1) {
            var target = $('#comments-list>ul>li[data-id="' + id + '"]').detach();
            if (length == 2) {
                var firstChild = $("#comments-list>ul>li:first-child");
                if (
                    parseInt($(firstChild).attr("data-top")) >
                    parseInt($(target).attr("data-top"))
                ) {
                    $(firstChild).before(target);
                } else {
                    $(firstChild).after(target);
                }
            } else {
                if (
                    parseInt($(target).attr("data-top")) >
                    parseInt($("#comments-list>ul>li:last-child").attr("data-top"))
                ) {
                    $("#comments-list>ul>li:last-child").after(target);
                } else {
                    for (var i = 1; i < length; i++) {
                        if (
                            parseInt($(target).attr("data-top")) <
                            parseInt(
                                $("#comments-list>ul>li:nth-child(" + i + ")").attr("data-top")
                            )
                        ) {
                            $("#comments-list>ul>li:nth-child(" + i + ")").before(target);
                            break;
                        } else if (
                            parseInt($(target).attr("data-top")) >
                            parseInt(
                                $("#comments-list>ul>li:nth-child(" + i + ")").attr(
                                    "data-top"
                                )
                            ) &&
                            parseInt($(target).attr("data-top")) <
                            parseInt(
                                $("#comments-list>ul>li:nth-child(" + (i + 1) + ")").attr(
                                    "data-top"
                                )
                            )
                        ) {
                            $("#comments-list>ul>li:nth-child(" + i + ")").after(target);
                            break;
                        } else {
                            i++;
                        }
                    }
                }
            }
        }
    }

    function updateStudents(classID, groupID) {
        // generate students list from the json
        $(".audience-students li").removeClass("selected");
        if (groupID != 4) {
            var studentsList = classID + groupID;
            if (
                studentsList == "a0" ||
                studentsList == "b0" ||
                studentsList == "c0"
            ) {
                $(".audience-students li").addClass("selected");
            } else {
                $(eval(studentsList)).each(function(i, v) {
                    $(".audience-students li:nth-child(" + v + ")").addClass("selected");
                });
            }
        }
    }

    function save() {
        // saves data i.e. comments and emotion, updates values needed to do calculation
        loginGroup = localStorage.getItem("auth").trim();
        pins = [];
        redactors = [];
        $.each($("#comments-list > ul > li"), function() {
            var comment = {};
            comment.text = $(this).attr("data-comment");
            comment.emotion = $(this).attr("data-emotion");
            comment.type = $(this).attr("data-type");
            comment.top = parseInt($(this).attr("data-top"));
            comment.left = parseInt($(this).attr("data-left"));
            comment.id = $(this).attr("data-id");
            pins.push(comment);
        });
        $.each($("#editor .rp"), function() {
            var redactor = {};
            redactor.id = $(this).attr("id");
            redactor.top = parseInt($(this).css("top"), 10);
            redactor.left = parseInt($(this).css("left"), 10);
            redactors.push(redactor);
        });
        meta.pageWidth = $(window).width();
        meta.pageHeight = $(window).height();
        meta.editorWidth = $("#editor-body").width();
        meta.editorHeight = $("#editor-body").height();
        meta.title = $("#assignment-title").text().trim();
    }

    function fetchEmotion(comment_text, onSuccess, onFail) {
        $.ajax(SERVER_URL + "/emotion", {
                data: JSON.stringify({ text: comment_text }),
                type: "POST",
                contentType: "application/json",
            })
            .done(function(data) {
                var emotions = data["emotion_classes"];
                if (emotions.length == 0) {
                    alert("Request successful but no emotion labeled");
                    emotion = null;
                } else {
                    // Take the first emotion returned by the API and map it to emotion category i.e. remove +/- if present
                    var emotion = emotions[0];
                    if (emotion.includes("+") || emotion.includes("-")) {
                        emotion = emotion.substr(0, emotion.length - 1);
                    }
                }
                onSuccess(emotion);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR["responseJSON"]);
                onFail();
            });
    }

    // aadya: code for type api and automated categorizing
    function fetchType(comment_text, onSuccess, onFail) {
        $.ajax(SERVER_URL + '/type', {
            'data': JSON.stringify({ text: comment_text }),
            'type': 'POST',
            'contentType': 'application/json'
        }).done(function(data) {
            var type = null;
            // console.log(data);
            var type_list = data['type_classes'];
            // console.log(type_list);
            if (type_list.length == 0) {
                console.log("Request successful but no emotion labeled");
            } else {
                // Take the first emotion returned by the API and map it to emotion category i.e. remove +/- if present
                type = type_list[0];

                // console.log(type);
                // console.log(type_list[0]);
            }
            onSuccess(type);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("type api request: ", jqXHR['responseJSON'])
            onFail();
        })
    }
    // End of aadya's code

    var prevEmotQueryText = "";

    function refreshEmotion() {
        var comment_text = $("#comment-input textarea").val().trim();
        if (comment_text == "") {
            emotion = "neutral";
            $(document)
                .find(
                    '#selected-emotion > ul li[data-id="' + getEmotionId(emotion) + '"]'
                )
                .click();
        } else if (comment_text != prevEmotQueryText) {
            // console.log('fetching new emotion')
            var old_class = $("#robot-emotions").attr("class");
            $("#robot-emotions").attr("class", "blink");
            fetchEmotion(
                comment_text,
                function(emotion) {
                    if (emotion == null) {
                        emotion = "neutral";
                    }
                    $(document)
                        .find(
                            '#selected-emotion > ul li[data-id="' +
                            getEmotionId(emotion) +
                            '"]'
                        )
                        .click();
                    prevEmotQueryText = comment_text;
                },
                function() {
                    $("#robot-emotions").attr("class", old_class);
                }
            );
            // Aadya's Code
            fetchType(comment_text, function(type) {
                if (type == null) {
                    $('[data-id=' + $('#pages .focused').attr('id') + '] .comment-container.has-dropdown ul li[data-type="0"]').click();
                } else {
                    type = type.replace(/\+/g, '').replace(/\-/g, '').trim().toLowerCase();
                    $('[data-id=' + $('#pages .focused').attr('id') + '] .comment-container.has-dropdown ul li[data-type="' + getTypeId(type) + '"]').click();
                }
                $(".custom-comment-title").removeClass("active");
            }, function() {
                $('[data-id=' + $('#pages .focused').attr('id') + '] .comment-container.has-dropdown ul li[data-type="0"]').click();
                $(".custom-comment-title").removeClass("active");
            });
            // End of Aadya's Code
        }
    }

    // flori: arranges the colors in the type bar
    function typeBar() {
        updateTypePanel();
        var typeCommentCount = commentPinCount - 1;
        $("#comments-list > ul > li").each(function() {
            if ($(this).attr("data-type") == 0) {
                typeCommentCount--;
            }
        });
        $.each(typePanel, function(i, v) {
            typePanel[i]["width"] = 0;
        });
        if (typeCommentCount > 0) {
            $.each(typePanel, function(i, v) {
                if (i != 0) {
                    typePanel[i]["width"] = (v.count / typeCommentCount) * 100;
                }
            });
        }
        var count = 1;
        $("#bottom-panel-type-bar > ul > li").each(function() {
            $(this).css("width", typePanel[count]["width"]);
            count++;
        });
    }

    // flori: emotions and type bar sort
    function sortTypeAndEmotions() {
        $(this).toggleClass("active");
        var hide = false;
        var hideEmotions = false;
        var hideType = false;
        $.each(emotionsPanel, function(i, v) {
            v.show = false;
        });
        $.each(typePanel, function(i, v) {
            v.show = false;
        });

        if (
            $(".emoji").hasClass("active") ||
            $(".hide-type ul li").hasClass("active")
        ) {
            $(".hide-type ul li").each(function() {
                if ($(this).hasClass("active")) {
                    var dataType = $(this).attr("data-type");
                    typePanel[dataType]["show"] = true;
                    hideType = true;
                }
            });
            $("#bottom-panel-emoji-panel-container ul li").each(function() {
                if ($(this).hasClass("active")) {
                    var emotion = $(this).attr("data-emotion");
                    emotionsPanel[emotion]["show"] = true;
                    hideEmotions = true;
                }
            });
            hide = true;
        }

        if (hide) {
            $("#comments-list > ul > li").each(function() {
                $(this).addClass("temporary-hidden");
            });
            $("#comments-list > ul > li").each(function() {
                var emotion = $(this).attr("data-emotion");
                var dataType = $(this).attr("data-type");
                if (hideEmotions) {
                    if (hideType) {
                        if (
                            emotionsPanel[emotion]["show"] == true &&
                            typePanel[dataType]["show"] == true
                        ) {
                            $(this).removeClass("temporary-hidden");
                        }
                    } else {
                        if (emotionsPanel[emotion]["show"]) {
                            $(this).removeClass("temporary-hidden");
                        }
                    }
                } else if (hideType) {
                    if (typePanel[dataType]["show"] == true) {
                        $(this).removeClass("temporary-hidden");
                    }
                }
            });
        } else {
            $("#comments-list > ul > li").each(function() {
                $(this).removeClass("temporary-hidden");
            });
        }
    }

    // flori: counter that tracks total for each comment type
    function updateTypePanel() {
        $.each(typePanel, function(i, v) {
            v.count = 0;
        });
        // $("#comments-list > ul > li").each(function() {
        //     if ($(this).attr("data-type") == 0) {
        //         typePanel[0]["count"]++;
        //     } else {
        //         typePanel[$(this).attr("data-type")]["count"]++;
        //     }
        // });
        $("#comments-list > ul > li").each(function() {
            typePanel[Number($(this).attr("data-type"))]["count"]++;
        });
        renderTypePanel();
    }

    // flori: renders type panel when called in updateTypePanel()
    function renderTypePanel() {
        $("#hide-bottom-panel-summary").text("Summary: " + typePanel[1]["count"]);
        $("#hide-bottom-panel-vocab").text("Vocab: " + typePanel[2]["count"]);
        $("#hide-bottom-panel-personal").text("Personal: " + typePanel[3]["count"]);
        $("#hide-bottom-panel-emotional").text(
            "Emotional: " + typePanel[4]["count"]
        );
    }

    // flori: counter that tracks total for each emotion
    function updateEmotionsPanel() {
        $.each(emotionsPanel, function(i, v) {
            v.count = 0;
        });
        $.each($("#comments-list > ul > li"), function() {
            emotionsPanel[$(this).attr("data-emotion")]["count"]++;
        });
        renderEmotionsPanel();
    }

    // flori: renders emotions panel when called in updateEmotionsPanel()
    function renderEmotionsPanel() {
        var containerUl = $("#bottom-panel-emoji-panel-container > ul");
        var showCount = 0;
        containerUl.empty();
        $.each(emotionsPanel, function(i, v) {
            if (v.count > 0) {
                showCount++;
                if (showCount < 7) {
                    containerUl.append(
                        '<li class="emoji" id="' +
                        v.id +
                        '" data-emotion="' +
                        i +
                        '"><span>' +
                        v.count +
                        '</span><div class="hide-emotion">' +
                        v.emote +
                        "</div></li>"
                    );
                } else {
                    containerUl.append('<li class="hidden-emoji-panel-button"></li>');
                }
            }
        });
    }

    // flori: adds custom comment dropdown to all custom comments
    function addCustomDropdown() {
        $('li[data-type="0"]>div[class="comment-container"]').each(function() {
            var $this = $(this);
            if (!$this.hasClass("has-dropdown")) {
                $this.addClass("has-dropdown");
                $this.prepend(
                    '<div class="custom-comment-title" data-type="0"><p>Custom Comment</p><ul><li data-type="0" class="active">Custom Comment</li><li data-type="1" data-group="student-summary">Summary</li><li data-type="2" data-group="vocab-support" >Vocabulary Support</li><li  data-type="3" data-group="personal-connection" >Personal Connection</li><li data-type="4" data-group="emotional-connection" >Emotional Connection</li></ul></div>'
                );
            }
        });
    }

    // flori: sorts review comments list based on sort-by option
    function checkSortOption() {
        var commentsList = $("#comments-list > ul");
        var comments = commentsList.find("li[data-emotion]");
        var sortedComments = comments.toArray().sort(function(a, b) {
            var aVal = $(a).find(".comment-id").text();
            var bVal = $(b).find(".comment-id").text();
            var activeOption = $('#sort-by > ul > li[class="active"]').text();
            if (activeOption == "Order") {
                aVal = $(a).find(".comment-id").text();
                bVal = $(b).find(".comment-id").text();
            } else if (activeOption == "Type") {
                aVal = $(a).attr("data-type");
                bVal = $(b).attr("data-type");
            } else if (activeOption == "Emotion") {
                aVal = $(a).attr("data-emotion");
                bVal = $(b).attr("data-emotion");
            }
            if (aVal < bVal) return -1;
            if (aVal > bVal) return 1;
            return 0;
        });

        commentsList.empty();
        commentsList.append(sortedComments);
    }
})(window.jQuery);