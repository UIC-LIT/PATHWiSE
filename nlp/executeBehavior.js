var behaviors = {
    "spooked": "SL 500\nFI eyes_terror.jpg\nFL true\nAU teethChatter.mp3\nTL 0 0 0 170 0 255 breathe 1220\nMH 0 10 0 90\nMT -75 0 500\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 5 2 100\nMH 0 5 -2 100\nMH 0 5 2 100\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100",
    "boredom": "SL 500\nFI eyes_boredom.jpg\nTL 0 0 0 47 0 255 breathe 3474\nMH -20 0 -5 100\nMAS 90 90 90 90",
    "sleepy": "SL 500\nnDIS Zzzzzz\nTL 0 0 0 0 255 145 breathe 4035\nMAS 90 90 90 90\nAU snoring.mp3\nn",
    "amazement": "SL 500\nFI eyes_amazement.jpg\nTL 0 0 0 255 102 0 breathe 485\nMH 0 -10 0 90\nSL 1000\nMAS -40 90 -40 90",
    "disgust": "SL 500\nFI eyes_disgust.jpg\nTL 0 0 0 255 0 179 breathe 1645\nMH 20 5 0 100\nMT -25 0 500",
    "ecstasy": "SL 500\nFI eyes_ecstasy_frame_1.jpg\nDFI eyes_ecstasy_frame_2.jpg 2500\nTL 0 0 0 255 179 0 breathe 748\nMH 0 -15 0 90\nMAS -80 100 -80 25",
    "fear": "SL 500\nFIB eyes_fear.jpg 250\nTL 0 0 0 166 0 255 breathe 1377\nMH 0 5 0 100\nSL 500\nMT -25 0 500",
    "distraction": "SL 500\nFI eyes_distraction.gif\nTL 0 0 0 255 81 0 breathe 491\nMH 0 -15 -20 95\nMAS 90 90 90 90\nSL 1750\nMH 10 -15 -15 100",
    "admiration": "SL 500\nFI eyes_admiration.jpg\nTL 0 0 0 255 242 0 breathe 1487\nMH 10 0 0 100",
    "rage": "SL 500\nFI eyes_rage.jpg\nTL 0 0 0 255 4 0 breathe 312\nMH 0 -10 0 100\nMAS -75 90 -75 90",
    "interest": "SL 500\nFI eyes_interest.jpg\nTL 0 0 0 255 179 0 breathe 1154\nMH -25 0 0 100\nSL 500\nMT 25 0 500\nMAS 90 90 90 90",
    "acceptance": "SL 500\nFI eyes_acceptance.jpg\nTL 0 0 0 51 255 0 breathe 2601\nMH 0 0 0 100\nMAS 90 90 90 90\nMH 0 10 0 100\nMH 0 0 0 100",
    "surprise": "SL 500\nFI eyes_surprise.png\nTL 0 0 0 255 132 0 breathe 747\nMH 0 -10 0 100\nMAS -90 100 -90 100\nMH 0 0 0 100",
    "joy": "SL 500\nFI eyes_joy.jpg\nTL 0 0 0 255 157 0 breathe 1123\nMH -20 -13 0 90\nMAS 55 90 55 90",
    "trust": "SL 500\nTL 0 0 0 47 255 0 breathe 2707\nMH -10 -7 0 90\nMT 25 0 500\nFI eyes_trust.jpg\nMAS 90 100 90 100",
    "loathing": "SL 500\nFI eyes_loathing.jpg\nTL 0 0 0 255 0 204 breathe 1383\nMH 0 0 0 90\nn",
    "anticipation": "SL 500\nTL 0 0 0 255 230 0 breathe 1702\nMH 0 -5 0 100\nMAS 55 100 55 100\nSL 500\nFI eyes_anticipation.png\nMT 25 0 500",
    "neutral": "SL 500\nFI eyes_default.jpg\nCL 255 255 255\nMH 0 0 0 100\nMAS 90 100 90 100",
    "annoyance": "SL 500\nFI eyes_annoyed.jpg\nTL 0 0 0 255 26 0 breathe 793\nMH 0 0 0 90\nMAS 90 90 90 90",
    "elicit": "SL 500\nFI eyes_anticipation.jpg\nCL 255 255 255\nMH -15 0 0 100\nMAS 100 100 100 100",
    "serenity": "SL 500\nMH -15 -5 0 90\nTL 0 0 0 0 255 145 breathe 4035\nFI eyes_serenity.jpg",
    "grief": "SL 500\nFI eyes_grief.jpg\nTL 0 0 0 8 0 255 breathe 3124\nMT -25 0 500\nMH 15 25 0 90\nMAS 90 90 90 90",
    "dancing": "SL 500\nFI eyes_ecstasy_frame_1.jpg\nMAS 90 90 -90 90\nMT 0 15\nDFI eyes_ecstasy_frame_2.jpg 2500\nMAS -90 90 90 90\nMT 0 -15\nTL 3 173 252 252 3 248 breathe 748\nMAS 90 90 -90 90\nMT 0 15s",
    "anger": "SL 500\nFI eyes_anger.jpg\nTL 0 0 0 255 17 0 breathe 896\nMH 0 -5 0 90\nMAS -10 90 5 90",
    "pensiveness": "SL 500\nFI eyes_pensiveness.jpg\nTL 0 0 0 34 0 255 breathe 3954\nMH 10 5 -10 100\nMAS 90 90 90 90",
    "vigilance": "SL 500\nFI eyes_vigilance.jpg\nTL 0 0 0 255 51 0 breathe 931\nMH -10 5 0 100\nMT 25 0 500\nMAS 60 90 60 90",
    "sadness": "SL 500\nFI eyes_sad.jpg\nTL 0 0 0 21 0 255 breathe 3310\nMH 0 7 0 90\nMAS 90 90 90 90",
    "apprehension": "SL 500\nFI eyes_apprehension.jpg\nTL 0 0 0 0 64 255 breathe 2387\nMAS 90 100 90 100\nMH 0 0 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 0 2 100\nMH 0 0 -2 100\nMAS 90 100 90 100\nSL 100\nMAS 80 100 80 100",
    "terror": "SL 500\nFI eyes_terror.jpg\nTL 0 0 0 170 0 255 breathe 1220\nMH 0 10 0 90\nMT -75 0 500\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 5 2 100\nMH 0 5 -2 100\nMH 0 5 2 100\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100",
    "intro": "SL 500\nFI eyes_default.jpg\nCL 255 255 255\nMH 0 0 0 100\nMAS 90 100 90 100",
};
const executeBehavior = async (behaviorName) => {
    const behaviorContent = behaviors[behaviorName] || behaviors.default;
    const instructions = behaviorContent.split('\n');
    console.log('Executing behavior:', instructions);
    for (const instruction of instructions) {
        const args = instruction.trim().split(' ');
        if (args.length < 2) continue;

        switch (args[0]) {
            case 'SL':
                await new Promise(resolve => setTimeout(resolve, parseInt(args[1])));
                break;
            case 'FI':
                console.log('Displaying image:', args[1]);
                await fetch(`http://${mistyIP}/api/images/display`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ FileName: args[1] })
                });
                break;
            case 'TL':
                console.log('Transitioning LED:', args[1], args[2], args[3], args[4], args[5], args[6]);
                await fetch(`http://${mistyIP}/api/led/transition`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Red: parseInt(args[1]),
                        Green: parseInt(args[2]),
                        Blue: parseInt(args[3]),
                        Red2: parseInt(args[4]),
                        Green2: parseInt(args[5]),
                        Blue2: parseInt(args[6]),
                        TransitionType: args[7],
                        TimeMS: parseInt(args[8])
                    })
                });
                break;
            case 'MH':
                console.log('Moving Head:', args[1], args[2], args[3], args[4]);
                await fetch(`http://${mistyIP}/api/head`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Roll: parseInt(args[1]),
                        Pitch: parseInt(args[2]),
                        Yaw: parseInt(args[3]),
                        Velocity: parseInt(args[4])
                    })
                });
                break;
            case 'MAS':
                await fetch(`http://${mistyIP}/api/arms/set`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        LeftArmPosition: parseInt(args[1]),
                        LeftArmVelocity: parseInt(args[2]),
                        RightArmPosition: parseInt(args[3]),
                        RightArmVelocity: parseInt(args[4])
                    })
                });
                break;
        }
    }

    console.log('Behavior executed Successfullly:', behaviorName);
};