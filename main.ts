function getDayOfWeek (day: number) {
    return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ][day]
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (menuOpen) {
        miniMenu.close(Settings_Menu)
        menuOpen = false
        return
    }
    menuOpen = true
    menuIcon = img`
        ................
        .......ddd......
        ......dbbb......
        ......dbdd......
        ......bddd......
        ......bcdbd.....
        ......cbcbdd....
        ......bdbdbd....
        .....cbdbdcd....
        .....cbbbddb....
        .....cfbdbdd....
        ....bcfbddbd....
        ....bcfdddd.....
        ....bfbdddd.....
        ...bbfdddddb....
        ...dcbdddddd....
        .....bdddddd....
        .....bddbddd....
        .....bddbdddb...
        .ccccbddbddddcc.
        cdddbbdbbddddbdc
        bddbdbdbbddbdbdb
        bddbdddbbddbbbdb
        bdddbddbbddbbddb
        bddddbbbbbbbbddb
        bdddddbbbbbddddb
        cddddddddddddddc
        bccddddddddddccb
        dbbbbbbbbbbbbbbd
        dbbbbccccccbbbbd
        cbbbbbbbbbbbbbbc
        fccccccccccccccf
        `
    Settings_Menu = miniMenu.createMenu(
    miniMenu.createMenuItem("Military Time ", menuIcon),
    miniMenu.createMenuItem("Date Toggle", menuIcon),
    miniMenu.createMenuItem("Close Menu", menuIcon)
    )
    miniMenu.setDimensions(Settings_Menu, 115, 85)
    miniMenu.onButtonPressed(Settings_Menu, miniMenu.Button.A, function (selection, selectedIndex) {
        if (selectedIndex == 0) {
            Military_Time_Boolem = !(Military_Time_Boolem)
            settings.writeNumber("military_time_setting", Military_Time_Boolem ? 1 : 0)
        } else if (selectedIndex == 1) {
            Date_Boolem = !(Date_Boolem)
            settings.writeNumber("date_setting", Date_Boolem ? 1 : 0)
        }
        miniMenu.close(Settings_Menu)
        menuOpen = false
    })
    miniMenu.onButtonPressed(Settings_Menu, miniMenu.Button.B, function (selection, selectedIndex) {
        miniMenu.close(Settings_Menu)
        menuOpen = false
    })
})
function formatNumber (value: number) {
    return ("0" + value).substr(-2)
}
function getMonth (month: number) {
    return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
    ][month]
}
let menuIcon: Image = null
let Settings_Menu: Sprite = null
let menuOpen = false
let Military_Time_Boolem = false
let Date_Boolem = false
scene.setBackgroundColor(13)
let Hour = sevenseg.createCounter(SegmentStyle.Thick, SegmentScale.Full, 2)
let Minutes = sevenseg.createCounter(SegmentStyle.Thick, SegmentScale.Full, 2)
let Seconds = sevenseg.createCounter(SegmentStyle.Medium, SegmentScale.Half, 2)
let AMPM = sevenseg.createDigit(SegmentStyle.Thick, 0)
let Colon = sprites.create(img`
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    ......ffff......
    ......ffff......
    ......ffff......
    ......ffff......
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    ......ffff......
    ......ffff......
    ......ffff......
    ......ffff......
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    ................
    `, SpriteKind.Player)
AMPM.setScale(SegmentScale.Half)
Colon.setPosition(80, 60)
Hour.setDigitColor(15)
Minutes.setDigitColor(15)
Seconds.setDigitColor(15)
AMPM.setDigitColor(15)
Hour.x += -25
Minutes.x += 25
Seconds.y += 8
Seconds.x += 60
AMPM.x += -50
AMPM.y += -8
if (!(settings.exists("military_time_setting"))) {
    settings.writeNumber("military_time_setting", 0)
}
if (!(settings.exists("date_setting"))) {
    settings.writeNumber("date_setting", 0)
}
let loadedMilitaryTime = settings.readNumber("military_time_setting")
let loadedDateToggle = settings.readNumber("date_setting")
Military_Time_Boolem = loadedMilitaryTime == 1
Date_Boolem = loadedDateToggle == 1
game.onShade(() => {
    const time = browserEvents.currentTime();
    const rawHours = browserEvents.getHours(time);
    const minutes = browserEvents.getMinutes(time);
    const seconds = browserEvents.getSeconds(time);

    if (Military_Time_Boolem) {
        Hour.count = rawHours;
        AMPM.setDigitAlpha(SegmentCharacter.E);
    } else {
        const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
        Hour.count = hours12;

        if (rawHours >= 12) {
            AMPM.setDigitAlpha(SegmentCharacter.P);
        } else {
            AMPM.setDigitAlpha(SegmentCharacter.A);
        }
    }

    Minutes.count = minutes;
    Seconds.count = seconds;

    if (!Date_Boolem) {
        const dayName = getDayOfWeek(browserEvents.getDayOfWeek(time));
        const monthName = getMonth(browserEvents.getMonth(time));
        const dateNum = formatNumber(browserEvents.getDayOfMonth(time));
        const yearNum = browserEvents.getYear(time) + "";

        screen.printCenter(`${dayName}, ${monthName} ${dateNum}`, 95, 15);
        screen.printCenter(yearNum, 107, 15);
    }
});
