$("#okay").click(function () {
    var command = $("select").val();
    if (scenes.length > 0) {
        playScene();
    } else {
        startScene(croom[command]);
    }
})

$("#audio").bind("ended", function () {
    $("#audio").attr("src", "");
    $("#music").get(0).play();
});

enterRoom = function (room) {
    run = function (data) {
        window.croom = window.data[room];
        $("select").empty();
        var items = [];
        $.each(Object.keys(croom), function (i, item) {
            if (item !== "initial" && item !== "default") {
                items.push('<option value=\"' + item + "\">" + item + '</option>');
            }
        });
        $("select").append(items.join(''));
        startScene(croom["initial"]);
    }
    if (window.croom == undefined) {
        $.getJSON(("/rooms"),
            function (a) {
                window.data = a;
                run(window.data[room]);
            });
    } else {
        run(window.data[room]);
    }
};
playScene = function () {
    var scene = scenes[0];
    if (scene.header == undefined) {
        $("#messages").append("<li>" + scene.content + "</li>");
    } else {
        $("#messages").append("<li><b>" + scene.header + "</b><br>" + scene.content + "</li>");
    }
    if ("set" in scene) {
        window[scene["set"]] = true;
    }
    $("img").attr("src", scene["image"]);
    playAudio(scene["audio"]);
    playMusic(scene["music"]);
    $("#caption").text(scene["caption"]);
    $("#subcaption").text(scene["subcaption"]);
    window.scenes = scenes.slice(1);
    if (window.scenes.length == 0) {
        $("select").removeAttr("disabled");
        $("select option[value='continue']").remove();
        $("img").attr("src", croom["default"])
    }
    if(scene.location !== undefined) {
      enterRoom(scene.location);
    }
};

startScene = function (scenes) {
    if ("if" in scenes) {
        for (i in scenes["if"]) {
            if (i !== "else" && window[i]) {
                console.log("a");
                window.scenes = scenes["if"][i];
            }
        }
        try {
            if (window.scenes == undefined) {
                console.log("b");
                window.scenes = scenes["else"];
            } else {
                if (window.scenes.length == 0) {
                    console.log(scenes);
                    window.scenes = scenes["else"];
                }
            }
        } catch (err) {
            if (window.scenes.length == 0) {
                console.log("c");
                window.scenes = scenes["else"];
            }
        }
    } else {
        console.log("d");
        window.scenes = scenes;
    }
    $("select").attr("disabled", "disabled");
    $("select").append("<option value=\"continue\">Continue...</option>");
    $("select").val("continue");
    $("ul#messages").empty();
    playScene();
}

playAudio = function (path) {
    $("#music").get(0).pause()
    $("#audio").attr("src", path);
    $("#audio").get(0).play();
}

playMusic = function (path) {
    $("#music").attr("src", path);
    $("#music").attr("loop", "loop");
    $("#music").get(0).play();
}

enterRoom("study");