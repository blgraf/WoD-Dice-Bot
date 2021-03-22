# WoD-Dice-Bot
A small Discord bot to roll dice for the WoD RPG.

## Features
- Integration into Discord for easy online rollplaying.
- 3 different types of roles:
    - Initiative
    - Regular
    - Specialisation
- Different rolls are visible in the result.

## Installation
```
git clone https://github.com/blgraf/WoD-Dice-Bot.git
cd WoD-Dice-Bot
npm install
```

## Usage
`!roll RollType [Option1] [Option2]`

RollTypes
    `init` - An initiative roll.
    `norm` - A normal roll.
    `spec` - A specialisation roll.
Option1
    `Initiative Modifier` - The modifier that is added on top of the roll.
    `Dice Count` - Only applicable with RollTypes `norm` and `spec`. Specifies the amount of d10 to be rolled.
Option2
    Only applicable with RollTypes `norm` and `spec`. Specifies the skill difficulty.
    Optional. Only has to specified if difficulty differs from the default value of 6.