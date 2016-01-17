//export default const MESSAGES = {
var MESSAGES = {
    "start": [
        "You are lost in the woods.",
        "It is snowing and you are cold.",
        "In 14 turns you will die of exposure."
    ],
    "scenarios": {
        "normal": "The snow continues to fall.",
        "wind": "You feel the wind begin to rise.",
        "wolf": [ //Deal with wolf later. Intention to create an indexed response based on weakness
            "You hear the nearby howl of a wolf.",
            "To your left, some distance away, you see the dark silhouette of a wolf",
            "The wolf is walking carefully on a path to intercept you.",
            "The wolf emits a deep growl and breaks into a run.",
            "The wolf is gaining on you!",
        ],
        "cabin": "Looking ahead, you detect the faint outlines of a cabin."
    },
    "results": {
        "wait": {
            "normal": "You look around through the trees hoping for.. something.",
            "repeat": "Standing still allows the cold to creep deeper into your bones.",
            "wind": "As the wind picks up you seek shelter next to a large tree.",
            "wolf": "The wolf stops, sniffs the ground, and looks right through you."
        },
        "walk": {
            "normal": "You step through the snow, the effort warms you slightly.",
            "wind": "As you walk, the wind bites into you.",
            "wolf": "You keep your eyes forward and try to ignore the beast."
        },
        "run": "You pick up your feet and begin to run.",
        "yell": {
            "normal": "You shout into the woods for help.",
            "wind": "The cold air overcomes your words and steals your breath.",
            "wolf": {
                "initial": [
                    "The wolf stops and stares at you,",
                    "its ears raised and pointed directly at you."
                ],
                "attn": [
                    "The wolf lowers its head to sniff the ground.",
                    "It then raises its head and looks off in another direction.",
                    "Slowly, he walks off and disappears back into the woods."
                ],
                "charge": [
                    "You yell at the wolf as loud and as fierce as you can,",
                    "he continues to charge without breaking stride."
                ]
            }
        },
        "end": ["...You have died."]
    }
}
