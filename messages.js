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
        "wolf": [ // Different levels indexed by current weakness
            "You hear the nearby howl of a wolf.",
            "To your left, some distance away, you see the dark silhouette of a wolf",
            "The wolf is walking carefully on a path to intercept you.",
            "You can feel the animal's heavy gaze without looking.",
            "The wolf emits a deep growl and breaks into a run.",
            "You hear the beast's footfalls as it breaks through the snow..",
            "The wolf is gaining on you!",
            "The animal grunts loudly as it lunges towards you..."
        ],
        "cabin": [
            "Looking ahead, you spot the silhouette of a... cabin?",
            "You head towards what is definitely a small cabin.",
            [
                "As you near the structure, you allow yourself to hope.",
                "You reach for the door.."
            ]
        ]
    },
    "results": {
        "wait": {
            "normal": "You look around through the trees hoping for.. something.",
            "repeat": "Standing still allows the cold to creep deeper into your bones.",
            "wind": "As the wind picks up you seek shelter next to a large tree.",
            "wolf": [
                "You stop and listen, your pulse is pounding in your ears.",
                "You try to locate the beast through the falling snow."
            ]
        },
        "walk": {
            "normal": "You step through the snow, the effort warms you slightly.",
            "wind": "As you walk, the wind bites into you.",
            "wolf": "You keep your eyes forward and try to ignore the beast."
        },
        "run": {
            "normal": "You pick up your feet and begin to run.",
            "wind": "As you run, the wind slashes at your skin.",
            "wolf": "Your sudden flight intrigues the predator.",
            "wolfCharge": "You're running for your life and dare not look back!"
        },
        "yell": {
            "normal": "You shout into the woods for help.",
            "wind": "The cold air overcomes your words and steals your breath.",
            "wolf": "You curse loudly at the beast! His recoil encourages you.",
            "wolfWind": [
                "The wind rises and steals your words.",
                "Your defiant posture warns the wolf."
            ]
        },
        "end": {
            "dead": [
                "Your feet refuse you, your momentum carries you forward.",
                "Lying on the ground, the snow falling around you."
                "You try to pull your legs up to your chest.",
                "There's no heat left to save.",
                "The winter chill takes you.."
            ],
            "win": [
                "You burst into the cabin, locking the door behind.",
                "In the room you spot a hearth.",
                "Stepping quickly but quietly you cross to the mantle.",
                "A box of matches.",
                "You set about making a fire. You are safe for now."
            ],
            "wolf": [
                "For a moment the predator's footfalls cease,",
                "As you turn to look, the weight of the beast lands fully upon you.",
                "As its jaw burrows through your coat towards your neck you smile,",
                "for this animal that will end your life has given you one last gift:",
                "Warmth, and then Death."
            ]
        }
    }
};
