var pause, chatting = !1,
    aPlayers = new Array,
    aPlaces = new Array,
    aScores = new Array,
    aTeams = new Array,
    aPseudos = new Array,
    fInfos, formulaire, baseCp, nBasePersos, customPersos, selectedDifficulty;
if (void 0 === edittingCircuit) var edittingCircuit = !1;
var isOnline = "OL" == page,
    isMCups = isCup && 4 < NBCIRCUITS,
    clRuleVars = {},
    clGlobalVars, selectPerso, challengesForCircuit;

function tourner(e) {
    if (null == e && (e = tourne), e == tourne) {
        var t = parseFloat(document.getElementsByTagName("img")[e].style.left),
            a = parseFloat(document.getElementsByTagName("img")[e].style.height);
        document.getElementsByTagName("img")[e].style.left = -21 * a < t ? t - a + "px" : "0px", setTimeout("tourner(" + e + ")", 100)
    }
}

function xhr(t, a, n, o) {
    var i;
    if (o = o || 1e3, window.XMLHttpRequest || window.ActiveXObject)
        if (window.ActiveXObject) try {
            i = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
            i = new ActiveXObject("Microsoft.XMLHTTP")
        } else i = new XMLHttpRequest;
    i.open("POST", t, !0), i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.setRequestHeader("If-Modified-Since", "Wed, 15 Nov 1995 00:00:00 GMT");
    try {
        i.onload = function() {
            200 == i.status ? n(i.responseText) || setTimeout(function() {
                xhr(t, a, n, 2 * o)
            }, o) : i.onerror()
        }, i.onerror = function() {
            setTimeout(function() {
                xhr(t, a, n, 2 * o)
            }, o)
        }
    } catch (e) {
        i.onreadystatechange = function() {
            4 != i.readyState || n(i.responseText) || setTimeout(function() {
                xhr(t, a, n, 2 * o)
            }, o)
        }
    }
    i.send(a)
}
if (void 0 === selectedTeams) var selectedTeams = 0;
if (void 0 === challenges) var challenges = {
    mcup: [],
    cup: [],
    track: []
};
if (void 0 === cupNames) var cupNames = [];

function MarioKart() {
    var oMaps = listMaps(),
        aAvailableMaps = new Array;
    for (circuits in void 0 === Array.isArray && (Array.isArray = function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }), oMaps) {
        aAvailableMaps.push(circuits);
        var oMap = oMaps[circuits];
        oMap.w || (oMap.w = 512), oMap.h || (oMap.h = 512), oMap.tours || (oMap.tours = 3), oMap.ref = 1 * circuits.replace("map", ""), oMap.aipoints && oMap.aipoints[0] && !Array.isArray(oMap.aipoints[0][0]) && (oMap.aipoints = [oMap.aipoints]), oMap.horspistes || (oMap.horspistes = {}, oMap.horspiste && (oMap.horspistes.herbe = oMap.horspiste, delete oMap.horspiste))
        if (oMap.decor && oMap.decor.length===undefined) {
            var type = undefined;
            for (type in oMap.decor) {
                oMap.decor = oMap.decor[type];
                for (var j=0;j<oMap.decor.length;j++) {
                    var donnee = oMap.decor[j];
                    switch (type) {
                        case 'taupe' :
                            donnee.push(undefined,0,(j%2) ? 9:0);
                            break;
                        case 'poisson' :
                            var pos1 = [3,0];
                            var pos2 = [-1,1];
                            donnee.push(undefined,pos1[j%2],pos2[j%2]);
                            break;
                        case 'plante' :
                            donnee.push(undefined,0,(1+j*2)%8);
                            break;
                        case 'thwomp' :
                        case 'spectre' :
                            var pos1 = [10,0];
                            var pos2 = [0,10];
                            donnee.push(undefined,pos1[j%2],pos2[j%2]);
                    }
                }
                oMap.decor.unshift(type);
                var infosPlus = ['taupe', 'poisson', 'plante', 'thwomp', 'spectre'];
                if (infosPlus.indexOf(type) !== -1) {
                    oMap.infoPlus = function(scope) {
                        var oMap = scope.map, oPlayers = scope.players;
                        switch (oMap.decor[0]) {
                        case 'taupe' :
                            for (var i=1;i<oMap.decor.length;i++) {
                                oMap.decor[i][4]++;
                                if (oMap.decor[i][4] >= 0) {
                                    if (oMap.decor[i][4]) {
                                        oMap.decor[i][3] += (oMap.decor[i][4] < 4) ? 2 : -1;
                                        if (oMap.decor[i][4] == 10) {
                                            oMap.decor[i][4] = -20;
                                            oMap.decor[i][3] = 10;
                                            for (var j=0;j<oPlayers.length;j++)
                                                oMap.decor[i][2][j].img.style.display = "none";
                                        }
                                    }
                                    else {
                                        for (var j=0;j<oPlayers.length;j++)
                                            oMap.decor[i][2][j].img.style.display = "block";
                                        oMap.decor[i][3] = 0;
                                    }
                                }
                            }
                            break;
                        case 'poisson' :
                            if (this.limite == undefined) {
                                this.limite = new Array();
                                for (i=1;i<oMap.decor.length;i++)
                                    this.limite[i] = [0,0];
                            }
                            for (var i=1;i<oMap.decor.length;i++) {
                                oMap.decor[i][3] += oMap.decor[i][4];
                                if (!oMap.decor[i][3])
                                    oMap.decor[i][4] = 1;
                                else if (oMap.decor[i][3] == 3) {
                                    oMap.decor[i][4] = -1;
                                    for (j=0;j<2;j++) {
                                        var dir = Math.floor(Math.random()*9)-4;
                                        if (Math.abs(this.limite[i][j]+dir) > 10)
                                            dir = -dir;
                                        this.limite[i][j] += dir;
                                        oMap.decor[i][j] += dir;
                                    }
                                }
                            }
                            break;
                        case 'plante' :
                            for (var i=1;i<oMap.decor.length;i++) {
                                oMap.decor[i][4]++;
                                if (oMap.decor[i][4] == 4) {
                                    for (j=0;j<oPlayers.length;j++)
                                        oMap.decor[i][2][j].setState(1);
                                }
                                else if (oMap.decor[i][4] == 8) {
                                    for (j=0;j<oPlayers.length;j++)
                                        oMap.decor[i][2][j].setState(0);
                                    oMap.decor[i][4] = 0;
                                }
                            }
                            break;
                        case 'thwomp' :
                        case 'spectre' :
                            for (var i=1;i<oMap.decor.length;i++) {
                                if (oMap.decor[i][4] < 0) {
                                    oMap.decor[i][4]++;
                                    if (!oMap.decor[i][4]) {
                                        oMap.decor[i][4] = -1;
                                        if (oMap.decor[i][3] < 10) oMap.decor[i][3]++;
                                        else oMap.decor[i][4] = 20;
                                    }
                                }
                                else {
                                    if (oMap.decor[i][4])
                                        oMap.decor[i][4]--;
                                    else {
                                        oMap.decor[i][3] -= 4;
                                        if (oMap.decor[i][3] < 0) {
                                            oMap.decor[i][3] = 0;
                                            oMap.decor[i][4] = -15;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    };
                }
                break;
            }
            if (!type)
                oMap.decor = ["tuyau"];
            console.log(oMap.decor);
        }
    }
    var iWidth = 80,
        iHeight = 39,
        iRendering = optionOf("quality"),
        iQuality, iSmooth;
    resetQuality();
    var bMusic = !!optionOf("music"),
        iSfx = !!optionOf("sfx"),
        gameMenu, refreshDatas = isOnline,
        finishing = !1,
        destructions = new Array,
        nbNews = new Array,
        connecte = 1;
    for (i = 0; i < 6; i++) destructions.push(new Array);
    var aIDs = new Array,
        tnCourse = 0,
        identifiant;
    "undefined" != typeof mId && (identifiant = mId), "undefined" == typeof cShared && (cShared = "AR" == page && 0 < nid), "undefined" != typeof shareLink && shareLink.options && shareLink.options.team && (selectedTeams = 1);
    var myCircuit = null != document.getElementById("changeRace"),
        oMusicHandler, objets;

    function setQuality(e) {
        bCounting || (iRendering = e, resetQuality(), bRunning && resetScreen(), xhr("changeParam.php", "param=0&value=" + e, function(e) {
            return 1 == e
        }))
    }

    function resetQuality() {
        iSmooth = 5 == iRendering ? !(iQuality = 1) : (iQuality = iRendering, !0)
    }

    function setScreenScale(e) {
        if (!bCounting) {
            var t = iScreenScale;
            iScreenScale = e, bRunning && resetScreen(), xhr("changeParam.php", "param=1&value=" + e, function(e) {
                return 1 == e
            });
            for (var a = 0; a < oContainers.length; a++) {
                var n = oContainers[a].firstChild;
                if (n) {
                    n.aScreenScale || (n.aScreenScale = t), n.style.width = iWidth * iScreenScale + "px", n.style.height = iHeight * iScreenScale + "px", n.style.transformOrigin = n.style.WebkitTransformOrigin = n.style.MozTransformOrigin = "top left", n.style.transform = n.style.WebkitTransform = n.style.MozTransform = "scale(" + iScreenScale / n.aScreenScale + ")";
                    var o = document.getElementById("fb-root");
                    o && (o.style.display = "none")
                }
            }
            reposKeyboard()
        }
    }

    function reposKeyboard() {
        var e = 4.8 * virtualButtonW,
            t = 2.6 * virtualButtonH;
        document.getElementById("virtualkeyboard").style.width = Math.round(e) + "px", document.getElementById("virtualkeyboard").style.height = Math.round(t) + "px", document.getElementById("virtualkeyboard").style.left = (iScreenScale * iWidth - e) / 2 + "px", document.getElementById("virtualkeyboard").style.top = 40 * iScreenScale + "px"
    }

    function setMusic(e) {
        bMusic = !!e, -1 != gameMenu && updateMenuMusic(gameMenu, !0), xhr("changeParam.php", "param=2&value=" + e, function(e) {
            return 1 == e
        })
    }

    function setSfx(e) {
        iSfx = !!e, xhr("changeParam.php", "param=3&value=" + e, function(e) {
            return 1 == e
        })
    }

    function removeMenuMusic(e) {
        clearTimeout(oMusicHandler), oMusicEmbed && document.body.contains(oMusicEmbed) && (e ? document.body.removeChild(oMusicEmbed) : fadeOutMusic(oMusicEmbed, 1, .8), oMusicEmbed = void 0)
    }

    function removeIfExists(e) {
        document.body.contains(e) && document.body.removeChild(e), oMusicEmbed == e && (oMusicEmbed = void 0)
    }

    function removeGameMusics() {
        if (bMusic || iSfx) {
            for (var e = document.getElementsByClassName("gamemusic"); e.length;) document.body.removeChild(e[0]);
            oMusicEmbed = void 0
        }
    }

    function pauseSounds() {
        if (bMusic || iSfx) {
            if (!clLocalVars.forcePause) playSoundEffect("musics/events/pause.mp3").className = "";
            for (var e = document.getElementsByClassName("gamemusic"), t = 0; t < e.length; t++) muteSound(e[t])
        }
    }

    function unpauseSounds() {
        (bMusic || iSfx) && (playSoundEffect("musics/events/pause.mp3").className = "", setTimeout(function() {
            if (!pause)
                for (var e = document.getElementsByClassName("gamemusic"), t = 0; t < e.length; t++) unmuteSound(e[t])
        }, 300))
    }

    function setMusicVolume(e, t) {
        isOriginalEmbed(e) ? e.volume = t : onPlayerReady(e, function(e) {
            e.setVolume(Math.round(100 * t))
        })
    }

    function fadeInMusic(e, t, a) {
        e.fadingOut || (e.fadingIn = !0, (t /= a) < 1 ? (setMusicVolume(e, t), e.fadingIn = !1, setTimeout(function() {
            fadeInMusic(e, t, a)
        }, 100)) : setMusicVolume(e, 1))
    }

    function fadeOutMusic(e, t, a, n) {
        e.fadingIn || (e.fadingOut = !0, .2 < (t *= a) ? (setMusicVolume(e, t), setTimeout(function() {
            fadeOutMusic(e, t, a, n)
        }, 100)) : (e.fadingOut = !1) === n ? (pauseMusic(e), setMusicVolume(e, 1)) : -1 !== n && stopMusic(e))
    }

    function updateMenuMusic(e, t) {
        e == gameMenu && !t || (gameMenu = e, removeMenuMusic(!bMusic), bMusic && (playMusicSmoothly("musics/menu/" + (gameMenu ? "selection-remix" : "main-remix") + ".mp3", t ? 0 : void 0), gameMenu || loopAfterIntro(oMusicEmbed, 60.15, 54.9)))
    }

    function playMusicSmoothly(e, t) {
        void 0 === t && (t = 1e3), (oMusicEmbed = document.createElement("audio")).setAttribute("loop", !0), oMusicEmbed.style.position = "absolute", oMusicEmbed.style.left = "-1000px", oMusicEmbed.style.top = "-1000px";
        var a = document.createElement("source");
        a.type = "audio/mpeg", a.src = e, oMusicEmbed.appendChild(a), clearTimeout(oMusicHandler), t ? oMusicHandler = setTimeout(function() {
            oMusicEmbed.play()
        }, t) : oMusicEmbed.setAttribute("autoplay", !0), document.body.appendChild(oMusicEmbed)
    }

    function playMusicRoughly(e) {
        playMusicSmoothly(e, 0)
    }
    objets = isOnline && isBattle ? ["fauxobjet", "fauxobjet", "fauxobjet", "fauxobjet", "banane", "banane", "banane", "banane", "banane", "banane", "banane", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "bobomb", "bobomb", "bobomb", "bobomb", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapace", "bobomb", "bobomb", "banane", "carapace", "carapace", "carapace", "carapace", "carapace", "banane", "banane", "fauxobjet", "carapacerouge", "carapacerouge", "carapacerouge", "banane", "banane", "banane", "banane", "banane", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacebleue", "carapacebleue", "carapacerouge", "megachampi", "megachampi", "megachampi", "megachampi", "etoile", "etoile", "etoile", "etoile", "champi", "champi", "champi", "champi"] : ["fauxobjet", "fauxobjet", "fauxobjet", "fauxobjet", "banane", "banane", "banane", "banane", "banane", "banane", "banane", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "carapace", "bobomb", "bobomb", "bobomb", "bobomb", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapace", "bobomb", "bobomb", "bobomb", "bobomb", "bobomb", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "bobomb", "bobomb", "bobomb", "bobomb", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacerouge", "carapacebleue", "carapacebleue", "carapacebleue", "carapacerouge", "carapacerouge", "megachampi", "megachampi", "megachampi", "megachampi", "champi", "champi", "champi", "champi", "champi", "champi", "carapacebleue", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "etoile", "etoile", "etoile", "etoile", "etoile", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "megachampi", "etoile", "etoile", "etoile", "etoile", "etoile", "etoile", "billball", "billball", "megachampi", "megachampi", "etoile", "etoile", "etoile", "etoile", "etoile", "billball", "billball", "billball", "billball", "billball", "eclair", "eclair", "eclair"];
    var oBgLayers = new Array,
        oPlayers = new Array;
    if (!pause)
        for (joueurs in baseCp && (cp = baseCp), baseCp = {}, customPersos = {}, nBasePersos = 0, cp) aPlayers.push(joueurs), baseCp[joueurs] = cp[joueurs], nBasePersos++;
    var bananes = new Array,
        fauxobjets = new Array,
        carapaces = new Array,
        bobombs = new Array,
        carapacesRouge = new Array,
        carapacesBleue = new Array,
        strPlayer = new Array,
        oMap, iDificulty = 5,
        iTeamPlay = selectedTeams,
        iTrajet, jTrajets, gPersos = new Array,
        gRecord, gSelectedPerso, oMapImg, oPlanDiv, oPlanDiv2, oPlanCtn, oPlanCtn2, oPlanImg, oPlanImg2, oPlanWidth, oPlanSize, oPlanRealSize, oCharWidth, oObjWidth, oExpWidth, oPlanWidth2, oPlanSize2, oCharWidth2, oObjWidth2, oExpWidth2, oTeamRatio, oCharRatio, oPlanRatio;

    function resetGame(e) {
        oMap = oMaps[e], loadMap()
    }
    pause && (strPlayer = fInfos.player, oMap = oMaps["map" + fInfos.map], "CM" != course ? iDificulty = fInfos.difficulty : (iTrajet = fInfos.my_route, gPersos = fInfos.perso, jTrajets = fInfos.cpu_route, gRecord = fInfos.record, gSelectedPerso = fInfos.selPerso));
    var oPlanCharacters = new Array,
        oPlanObjects = new Array,
        oPlanDecor = new Array,
        oPlanFauxObjets = new Array,
        oPlanBananes = new Array,
        oPlanBobOmbs = new Array,
        oPlanCarapaces = new Array,
        oPlanCarapacesRouges = new Array,
        oPlanCarapacesBleues = new Array,
        oPlanEtoiles = new Array,
        oPlanBillballs = new Array,
        oPlanTeams = new Array,
        oPlanCharacters2 = new Array,
        oPlanObjects2 = new Array,
        oPlanDecor2 = new Array,
        oPlanFauxObjets2 = new Array,
        oPlanBananes2 = new Array,
        oPlanBobOmbs2 = new Array,
        oPlanCarapaces2 = new Array,
        oPlanCarapacesRouges2 = new Array,
        oPlanCarapacesBleues2 = new Array,
        oPlanEtoiles2 = new Array,
        oPlanBillballs2 = new Array,
        oPlanTeams2 = new Array,
        vitesse;

    function posImg(e, t, a, n, o, i) {
        var r = -t / oPlanRealSize,
            l = -a / oPlanRealSize;
        return e.style.transform = e.style.WebkitTransform = e.style.MozTransform = "translate(" + -Math.round(i * r + o / 2) + "px, " + -Math.round(i * l + o / 2) + "px) rotate(" + Math.round(180 - n) + "deg)", e
    }

    function posImgRel(e, t, a, n, o, i, r, l) {
        var s = -t / oPlanRealSize,
            c = -a / oPlanRealSize;
        return e.style.transform = e.style.WebkitTransform = e.style.MozTransform = "translate(" + (Math.round(r) - Math.round(i * s + o / 2)) + "px, " + (Math.round(l) - Math.round(i * c + o / 2)) + "px) rotate(" + Math.round(180 - n) + "deg)", e
    }

    function setPlanPos() {
        var u = oPlayers[0],
            e = Math.round(u.rotation - 180),
            t = direction(1, e),
            a = direction(0, e);

        function r(e, t, a, n, o, i, r) {
            if (posImg(e, t, a, u.rotation, n, o), 0 <= i && e.team != i) {
                var l = i ? "red" : "blue";
                e.team = i, e.style.background = "radial-gradient(ellipse at center, " + l + " 0%,transparent " + r + "%)"
            }
            return e
        }

        function l(e, t, a, n, o) {
            if (e.length != t.length) {
                for (; e.length < t.length;) e.push((i = a, r = n, l = o, s = void 0, (s = document.createElement("img")).src = "images/map_icons/" + i + ".png", s.style.position = "absolute", s.style.width = r, s.className = "pixelated", l.appendChild(s), s));
                for (; e.length > t.length;) o.removeChild(e[0]), e.shift()
            }
            var i, r, l, s
        }
        var n = u.x / oPlanRealSize,
            o = u.y / oPlanRealSize;

        function i(e, t, a) {
            for (var n = 0; n < aKarts.length; n++) {
                var o = !0;
                if (aKarts[n].loose && (isOnline || aKarts[n] == u ? e[n].style.opacity = .25 : (e[n].style.display = "none", iTeamPlay && t == oCharWidth && (oPlanTeams[n].style.display = "none", oPlanTeams2[n].style.display = "none"), o = !1)), o) {
                    var i = aKarts[n].billball ? 1.5 : aKarts[n].size,
                        r = Math.round(t * i);
                    if (e[n].style.width = r + "px", posImg(e[n], aKarts[n].x, aKarts[n].y, aKarts[n].rotation - 360 * aKarts[n].tourne / 21, r, a), iTeamPlay && t == oCharWidth) {
                        var l = Math.round(oCharWidth2 * i),
                            s = Math.round(oTeamWidth * i),
                            c = Math.round(oTeamWidth2 * i);
                        posImgRel(oPlanTeams[n], aKarts[n].x, aKarts[n].y, Math.round(u.rotation), r, oPlanSize, (r - s) / 2, (r - s) / 2), oPlanTeams[n].style.width = s + "px", oPlanTeams[n].style.height = s + "px", posImgRel(oPlanTeams2[n], aKarts[n].x, aKarts[n].y, Math.round(u.rotation), l, oPlanSize2, (l - c) / 2, (l - c) / 2), oPlanTeams2[n].style.width = c + "px", oPlanTeams2[n].style.height = c + "px"
                    }
                }
            }
        }

        function s(e) {
            for (var t = 0; t < oMap.arme.length; t++) isNaN(oMap.arme[t][2]) ? e[t].style.display = "block" : e[t].style.display = "none"
        }

        function c(e, t, a, n) {
            if (oMap.decor && oMap.decor.length - 1 != e.length) {
                l(e, oMap.decor.slice(1), oMap.decor[0], t, a);
                for (var o = 1; o < oMap.decor.length; o++) r(e[o - 1], oMap.decor[o][0], oMap.decor[o][1], t, n)
            }
        }
        oPlanCtn.style.transform = oPlanCtn.style.WebkitTransform = oPlanCtn.style.MozTransform = "translate(" + -Math.round(oPlanSize * (n * t - o * a) - oPlanWidth / 2) + "px, " + -Math.round(oPlanSize * (n * a + o * t) - oPlanWidth / 2) + "px) rotate(" + e + "deg)", i(oPlanCharacters, oCharWidth, oPlanSize), i(oPlanCharacters2, oCharWidth2, oPlanSize2), s(oPlanObjects), s(oPlanObjects2), c(oPlanDecor, oObjWidth, oPlanCtn, oPlanSize), c(oPlanDecor2, oObjWidth2, oPlanCtn2, oPlanSize2), l(oPlanFauxObjets, fauxobjets, "objet", oObjWidth, oPlanCtn), l(oPlanFauxObjets2, fauxobjets, "objet", oObjWidth2, oPlanCtn2);
        for (var p = 0; p < fauxobjets.length; p++) r(oPlanFauxObjets[p], fauxobjets[p][3], fauxobjets[p][4], oObjWidth, oPlanSize, fauxobjets[p][2], 200), r(oPlanFauxObjets2[p], fauxobjets[p][3], fauxobjets[p][4], oObjWidth2, oPlanSize2, fauxobjets[p][2], 200), oPlanFauxObjets[p].style.zIndex = oPlanFauxObjets2[p].style.zIndex = 2;
        l(oPlanBananes, bananes, "banane", oObjWidth, oPlanCtn), l(oPlanBananes2, bananes, "banane", oObjWidth2, oPlanCtn2);
        for (p = 0; p < bananes.length; p++) r(oPlanBananes[p], bananes[p][3], bananes[p][4], oObjWidth, oPlanSize, bananes[p][2], 100), r(oPlanBananes2[p], bananes[p][3], bananes[p][4], oObjWidth2, oPlanSize2, bananes[p][2], 100), oPlanBananes[p].style.zIndex = oPlanBananes2[p].style.zIndex = 2;

        function d(e, t) {
            switch (t) {
                case 0:
                    e = "explosionB";
                    break;
                case 1:
                    e = "explosionR"
            }
            return "images/map_icons/" + e + ".png"
        }

        function m(e, t, a, n, o) {
            l(e, bobombs, "bob-omb", t, a);
            for (var i = 0; i < bobombs.length; i++) bobombs[i][8] <= 0 ? (posImg(e[i], bobombs[i][3], bobombs[i][4], Math.round(u.rotation), o, n).src = d("explosion", bobombs[i][2]), e[i].style.width = o + "px", e[i].style.opacity = Math.max(1 + bobombs[i][8] / 10, 0), e[i].style.background = "") : r(e[i], bobombs[i][3], bobombs[i][4], t, n, bobombs[i][2], 100).style.zIndex = 2
        }
        m(oPlanBobOmbs, oObjWidth, oPlanCtn, oPlanSize, oExpWidth), m(oPlanBobOmbs2, oObjWidth2, oPlanCtn2, oPlanSize2, oExpWidth2), l(oPlanCarapaces, carapaces, "carapace", oObjWidth, oPlanCtn), l(oPlanCarapaces2, carapaces, "carapace", oObjWidth2, oPlanCtn2);
        for (p = 0; p < carapaces.length; p++) {
            var y = r(oPlanCarapaces[p], carapaces[p][3], carapaces[p][4], oObjWidth, oPlanSize, carapaces[p][2], 200),
                h = r(oPlanCarapaces2[p], carapaces[p][3], carapaces[p][4], oObjWidth2, oPlanSize2, carapaces[p][2], 200),
                g = carapaces[p][7] < 0;
            g && !y.red ? (y.red = 1, y.src = "images/map_icons/carapace-rouge.png", h.src = "images/map_icons/carapace-rouge.png") : !g && y.red && (y.red = void 0, y.src = "images/map_icons/carapace.png", h.src = "images/map_icons/carapace.png"), h.style.zIndex = 2
        }
        l(oPlanCarapacesRouges, carapacesRouge, "carapace-rouge", oObjWidth, oPlanCtn), l(oPlanCarapacesRouges2, carapacesRouge, "carapace-rouge", oObjWidth2, oPlanCtn2);
        for (p = 0; p < carapacesRouge.length; p++) r(oPlanCarapacesRouges[p], carapacesRouge[p][3], carapacesRouge[p][4], oObjWidth, oPlanSize, carapacesRouge[p][2], 200), r(oPlanCarapacesRouges2[p], carapacesRouge[p][3], carapacesRouge[p][4], oObjWidth2, oPlanSize2, carapacesRouge[p][2], 200).style.zIndex = 2, carapacesRouge[p][6] && (oPlanCarapacesRouges[p].style.zIndex = 2);

        function f(e, t, a, n, o) {
            l(e, carapacesBleue, "carapace-bleue", t, o);
            for (var i = 0; i < carapacesBleue.length; i++) carapacesBleue[i][6] <= 0 ? (posImg(e[i], carapacesBleue[i][3], carapacesBleue[i][4], Math.round(u.rotation), n, a).src = d("explosionB", carapacesBleue[i][2]), e[i].style.width = n + "px", e[i].style.opacity = Math.max(1 + carapacesBleue[i][6] / 10, 0), e[i].style.background = "") : r(e[i], carapacesBleue[i][3], carapacesBleue[i][4], t, a, carapacesBleue[i][2], 200).style.zIndex = 2
        }
        f(oPlanCarapacesBleues, oObjWidth, oPlanSize, oExpWidth, oPlanCtn), f(oPlanCarapacesBleues2, oObjWidth2, oPlanSize2, oExpWidth2, oPlanCtn2);
        var S = new Array,
            b = new Array;
        for (p = 0; p < aKarts.length; p++) aKarts[p].etoile ? S.push(aKarts[p]) : aKarts[p].billball && b.push(aKarts[p]);
        l(oPlanEtoiles, S, "etoile", oObjWidth, oPlanCtn), l(oPlanEtoiles2, S, "etoile", oObjWidth2, oPlanCtn2);
        for (p = 0; p < S.length; p++) r(oPlanEtoiles[p], S[p].x, S[p].y, oObjWidth, oPlanSize), r(oPlanEtoiles2[p], S[p].x, S[p].y, oStarWidth2, oPlanSize2).style.width = oStarWidth2 + "px", oPlanEtoiles[p].style.zIndex = oPlanEtoiles2[p].style.zIndex = 2;
        l(oPlanBillballs, b, "billball", oObjWidth, oPlanCtn), l(oPlanBillballs2, b, "billball", oObjWidth2, oPlanCtn2);
        for (p = 0; p < b.length; p++) posImg(oPlanBillballs[p], b[p].x, b[p].y, Math.round(u.rotation), oBBWidth, oPlanSize).style.width = oBBWidth + "px", posImg(oPlanBillballs2[p], b[p].x, b[p].y, Math.round(u.rotation), oBBWidth2, oPlanSize2).style.width = oBBWidth2 + "px", oPlanBillballs[p].style.zIndex = oPlanBillballs2[p].style.zIndex = 2
    }

    function removePlan() {
        try {
            document.body.removeChild(oPlanDiv)
        } catch (e) {}
        try {
            document.body.removeChild(oPlanDiv2)
        } catch (e) {}
    }

    function loadMap() {
        (oMapImg = new Image).onload = startGame, oMapImg.src = isCup ? complete ? "images/uploads/" + ("BB" == course ? "course" : "map") + oMap.map + "." + oMap.ext : "mapcreate.php" + oMap.map : "images/tracks/map" + oMap.map + ".png", formulaire.screenscale.disabled = !0, formulaire.quality.disabled = !0, formulaire.music.disabled = !0, formulaire.sfx.disabled = !0, iTeamPlay = isTeamPlay(), setSRest(), document.body.style.cursor = "progress";
        for (var e = 0; e < strPlayer.length; e++) {
            var t = e * (iWidth * iScreenScale + 2);
            pause && fInfos.replay || (document.getElementById("compteur" + e).style.left = 15 + t + "px", document.getElementById("compteur" + e).style.top = 36 * iScreenScale + 8 + "px", document.getElementById("compteur" + e).style.fontSize = 2 * iScreenScale + "pt", document.getElementById("compteur" + e).innerHTML = "BB" != course ? (oMap.sections ? "Section" : toLanguage("Lap", "Tour")) + ' <span id="tour' + e + '">1</span>/' + oMap.tours : '&nbsp;<img src="' + balloonSrc(aTeams[e]) + '" style="width: ' + 2 * iScreenScale + '" /><img src="' + balloonSrc(aTeams[e]) + '" style="width: ' + 2 * iScreenScale + '" /><img src="' + balloonSrc(aTeams[e]) + '" style="width: ' + 2 * iScreenScale + '" /><img src="' + balloonSrc(aTeams[e]) + '" style="width: ' + 2 * iScreenScale + '" />', document.getElementById("objet" + e).style.left = 14 + t + "px", document.getElementById("objet" + e).style.width = 9 * iScreenScale + "px", document.getElementById("objet" + e).style.height = 8 * iScreenScale + "px", document.getElementById("objet" + e).style.visibility = "visible"), document.getElementById("temps" + e).style.left = 56 * iScreenScale + t + "px", document.getElementById("temps" + e).style.fontSize = 2 * iScreenScale + "pt";
            var a = document.getElementById("lakitu" + e);
            a && (a.style.width = 9 * iScreenScale + "px", a.style.height = Math.round(6.6 * iScreenScale) + "px", a.style.fontSize = Math.round(2.3 * iScreenScale) + "px"), getDriftImg(e).style.width = 8 * iScreenScale + "px", document.getElementById("drift" + e).style.left = 36 * iScreenScale + 12 + t + "px", document.getElementById("drift" + e).style.top = Math.round(32 * iScreenScale + 10) + "px", getDriftImg(e).style.left = "0px", getDriftImg(e).style.top = "0px", document.getElementById("infos" + e).style.left = 10 + 35 * iScreenScale + t + "px", document.getElementById("infos" + e).style.top = 10 + 8 * iScreenScale + "px", document.getElementById("infos" + e).style.fontSize = 10 * iScreenScale + "pt", document.getElementById("infos" + e).innerHTML = '<tr><td id="decompte' + e + '">3</td></tr>', document.getElementById("infoPlace" + e).style.left = 58 * iScreenScale + 10 + t + "px", document.getElementById("infoPlace" + e).style.top = 24 * iScreenScale + 10 + "px", document.getElementById("infoPlace" + e).style.width = 22 * iScreenScale + "px", document.getElementById("infoPlace" + e).style.fontSize = 10 * iScreenScale + "pt", document.getElementById("scroller" + e).style.width = 8 * iScreenScale + "px", document.getElementById("scroller" + e).style.height = 7 * iScreenScale + "px", document.getElementById("scroller" + e).style.lineHeight = iScreenScale + "px", document.getElementById("scroller" + e).setAttribute("width", 8 * iScreenScale + "px"), document.getElementById("scroller" + e).setAttribute("height", 7 * iScreenScale + "px"), document.getElementById("scroller" + e).style.top = Math.round(13 + .2 * iScreenScale) + "px", document.getElementById("scroller" + e).style.left = Math.round(14 + .5 * iScreenScale + t) + "px", document.getElementById("scroller" + e).getElementsByTagName("div")[0].style.left = Math.round(.1 * iScreenScale + 1) + "px", document.getElementById("mariokartcontainer").style.top = 31 * iScreenScale + 10 + "px";
            var n = 8 * iScreenScale - 3
        }
        initMap();
        n = 8 * iScreenScale - 3;
        for (var o = 0; o < document.getElementsByClassName("aObjet").length; o++) document.getElementsByClassName("aObjet")[o].style.width = n + "px";
        removeMenuMusic(), bMusic && !isOnline && loadMapMusic()
    }

    function getShapeType(e) {
        return "number" == typeof e[0] ? "rectangle" : "polygon"
    }

    function classifyByShape(e) {
        for (var t = {
                rectangle: [],
                polygon: []
            }, a = 0; a < e.length; a++) t[getShapeType(e[a])].push(e[a]);
        return t
    }

    function initMap() {
        if (oMap.collision && (oMap.collision = classifyByShape(oMap.collision)), oMap.horspistes)
            for (var e in oMap.horspistes) oMap.horspistes[e] = classifyByShape(oMap.horspistes[e]);
        if (oMap.trous)
            for (var t = 0; t < 4; t++) {
                for (var a = {
                        rectangle: [],
                        polygon: []
                    }, n = 0; n < oMap.trous[t].length; n++) {
                    var o = oMap.trous[t][n];
                    6 == o.length && (o = [
                        [o[0], o[1], o[2], o[3]],
                        [o[4], o[5]]
                    ]), a[getShapeType(o[0])].push(o)
                }
                oMap.trous[t] = a
            }
        if (oMap.accelerateurs)
            for (t = 0; t < oMap.accelerateurs.length; t++) {
                var i = oMap.accelerateurs[t];
                i[2] ? (i[2]++, i[3]++) : (i[2] = 9, i[3] = 9)
            }
    }
    var time = 0,
        timer = 0;
    iScreenScale = optionOf("screenscale");
    var fMaxRotInc = 6;

    function addNewItem(e, t, a) {
        if (t.push(a), e == oPlayers[0] && clLocalVars.myItems && clLocalVars.myItems.push(a), -1 != a[2]) {
            var n;
            switch (t) {
                case bananes:
                    n = 50;
                    break;
                case carapaces:
                case carapacesRouge:
                    n = 60;
                    break;
                case fauxobjets:
                    n = 65;
                    break;
                case carapacesBleue:
                    n = 60;
                    break;
                case bobombs:
                    n = 40;
                    break;
                default:
                    n = 60
            }
            var o = 50 - n,
                i = 50 - n;
            switch (t) {
                case bananes:
                case bobombs:
                    i += 5;
                    break;
                case fauxobjets:
                    i -= 5
            }
            for (var r = 0; r < oPlayers.length; r++) {
                var l = document.createElement("div");
                l.className = "sprite-hallow", l.style.position = "absolute", l.style.left = o + "%", l.style.top = i + "%", l.style.width = 2 * n + "%", l.style.height = 2 * n + "%", l.style.borderRadius = n + "%", l.style.backgroundColor = a[2] ? "red" : "blue", l.style.opacity = .25;
                var s = a[0][r].div.firstChild;
                s ? a[0][r].div.insertBefore(l, s) : a[0][r].div.appendChild(l)
            }
        }
    }

    function arme(e, t) {
        var a = aKarts[e];
        if (a.using[0]) {
            var n = a.x,
                o = a.y;
            switch (a.using[2]) {
                case "banane":
                    var i = n - (l = 30 / (a.speed + 5)) * direction(0, a.rotation),
                        r = o - l * direction(1, a.rotation);
                    tombe(Math.round(i), Math.round(r)) || addNewItem(a, bananes, [new Sprite("banane"), -1, a.team, i, r, 0]), playIfShould(a, "musics/events/put.mp3");
                    break;
                case "fauxobjet":
                    var l = 30 / (a.speed + 5);
                    addNewItem(a, fauxobjets, [new Sprite("objet"), -1, a.team, n - l * direction(0, a.rotation), o - l * direction(1, a.rotation), 0]), playIfShould(a, "musics/events/put.mp3");
                    break;
                case "carapace":
                    var s = angleShoot(a, t),
                        c = t ? 7.5 : 15;
                    addNewItem(a, carapaces, [new Sprite("carapace"), -1, a.team, n + c * direction(0, s), o + c * direction(1, s), 0, s, 10]), playDistSound(a, "musics/events/throw.mp3", 50);
                    break;
                case "carapacerouge":
                    s = angleShoot(a, t);
                    t ? addNewItem(a, carapaces, [new Sprite("carapace-rouge"), -1, a.team, n + 7.5 * direction(0, s), o + 7.5 * direction(1, s), 0, s, -1]) : addNewItem(a, carapacesRouge, [new Sprite("carapace-rouge"), -1, a.team, n + 15 * direction(0, s), o + 15 * direction(1, s), 0, s, a.id, -1]), playDistSound(a, "musics/events/throw.mp3", 50);
                    break;
                case "bobomb":
                    s = angleShoot(a, t);
                    addNewItem(a, bobombs, t ? [new Sprite("bob-omb"), -1, a.team, n + 5 * direction(0, s), o + 5 * direction(1, s), 0, s, 2, 42] : [new Sprite("bob-omb"), -1, a.team, n, o, 0, s, 15, 30]), playDistSound(a, "musics/events/throw.mp3", 50);
                    break;
                default:
                    return
            }
            detruit(a.using[0], a.using[1])
        } else {
            if (25 != a.roulette) return;
            var u;
            switch (a == oPlayers[0] && (clLocalVars.itemsUsed = !0), a.arme) {
                case "champi":
                    u = 20, a.maxspeed = 11, a.speed = 11, playIfShould(a, "musics/events/boost.mp3");
                    break;
                case "etoile":
                    u = 60;
                    for (var p = 0; p < strPlayer.length; p++) a.sprite[p].img.src = getStarSrc(a.personnage);
                    a.cpu || a.etoile || (isOnline || (a.sprite[0].img.onload = function() {
                        bCounting = !1, this.onload = void 0, reprendre(!1)
                    }, bCounting = pause = !0), shouldPlayMusic(a) && !oPlayers[1] && postStartMusic("musics/events/starman.mp3")), 0 < a.speedinc && (a.speedinc *= 5), a.protect = !0;
                    break;
                case "billball":
                    u = Math.max(Math.min(Math.round(distanceToFirst(a) / 6), 120), 50);
                    for (p = 0; p < strPlayer.length; p++) a.sprite[p].img.src = "images/sprites/sprite_billball.png";
                    a.cpu || isOnline || (a.sprite[0].img.onload = function() {
                        bCounting = !1, this.onload = void 0, reprendre(!1)
                    }, bCounting = pause = !0), a.rotinc = 0, a.size = 2.5, a.z = 2, a.protect = !0, a.champi = 0, resetPowerup(a), playIfShould(a, "musics/events/boost.mp3"), stopDrifting(e);
                    break;
                case "megachampi":
                    u = 50, a.size = 1, updateDriftSize(e), a.protect = !0, a.megachampi || !shouldPlayMusic(a) || oPlayers[1] || postStartMusic("musics/events/megamushroom.mp3");
                    break;
                case "eclair":
                    for (u = 100, p = 0; p < aKarts.length; p++) {
                        var d = aKarts[p];
                        friendlyFire(d, a) || (d.protect ? d.megachampi = d.megachampi < 8 || d.etoile ? d.megachampi : 8 : (d.size = .6, updateDriftSize(p), d.arme = !1, d.using[0] && (d.using[0][d.using[1]][5] && (d.using[0][d.using[1]][5] = 0), d.using = [!1]), d.champi = 0, d.spin(20), d.roulette = 0, stopDrifting(p), supprArme(p)))
                    }!iSfx || finishing || a.cpu || playSoundEffect("musics/events/lightning.mp3"), document.getElementById("mariokartcontainer").style.opacity = .7;
                    break;
                case "banane":
                    a.using = [bananes, bananes.length, "banane"], addNewItem(a, bananes, [new Sprite("banane"), -1, a.team, a.x - 5 * direction(0, a.rotation), a.y - 5 * direction(1, a.rotation), a.z]), playIfShould(a, "musics/events/item_store.mp3");
                    break;
                case "fauxobjet":
                    a.using = [fauxobjets, fauxobjets.length, "fauxobjet"], addNewItem(a, fauxobjets, [new Sprite("objet"), -1, a.team, a.x - 5 * direction(0, a.rotation), a.y - 5 * direction(1, a.rotation), a.z]), playIfShould(a, "musics/events/item_store.mp3");
                    break;
                case "carapace":
                    a.using = [carapaces, carapaces.length, "carapace"], addNewItem(a, carapaces, [new Sprite("carapace"), -1, a.team, a.x - 5 * direction(0, a.rotation), a.y - 5 * direction(1, a.rotation), a.z, -1, 10]), playIfShould(a, "musics/events/item_store.mp3");
                    break;
                case "carapacerouge":
                    a.using = [carapacesRouge, carapacesRouge.length, "carapacerouge"], addNewItem(a, carapacesRouge, [new Sprite("carapace-rouge"), -1, a.team, a.x - 5 * direction(0, a.rotation), a.y - 5 * direction(1, a.rotation), a.z, -1, -1, -1]), playIfShould(a, "musics/events/item_store.mp3");
                    break;
                case "carapacebleue":
                    var m = aKarts[aKarts.length - 1].id,
                        y = 1;
                    for (p = 0; p < aKarts.length; p++) aKarts[p].place == y && (p = (aKarts[p].tours <= oMap.tours || "BB" == course) && !sameTeam(a.team, aKarts[p].team) ? (m = aKarts[p].id, aKarts.length) : (y++, -1));
                    addNewItem(a, carapacesBleue, [new Sprite("carapace-bleue"), -1, a.team, a.x, a.y, m, 5]), playDistSound(a, "musics/events/throw.mp3", 50);
                    break;
                case "bobomb":
                    a.using = [bobombs, bobombs.length, "bobomb"], addNewItem(a, bobombs, [new Sprite("bob-omb"), -1, a.team, a.x - 5 * direction(0, a.rotation), a.y - 5 * direction(1, a.rotation), a.z, -1, 15, 30]), playIfShould(a, "musics/events/item_store.mp3")
            }
            u && (a[a.arme] = u), supprArme(e)
        }
    }
    var aKarts = new Array,
        bRunning = !1,
        bCounting = !1,
        musicIdInc = 0,
        mapMusic, endingMusic, endGPMusic, challengeMusic, carEngine, carEngine2, carEngine3, carDrift, carSpark;

    function loadMusic(e, t) {
        var a, n = isOriginalMusic(e);
        if (n)(a = document.createElement("audio")).setAttribute("loop", !0);
        else {
            var o = youtube_parser(e);
            (a = document.createElement("iframe")).id = "youtube-video-" + musicIdInc++, a.src = "https://www.youtube.com/embed/" + o + "?" + (t ? "autoplay=1&amp;" : "") + "loop=1&amp;playlist=" + o + "&amp;enablejsapi=1&amp;allow=autoplay", a.setAttribute("enablejsapi", 1), a.setAttribute("allow", "autoplay")
        }
        if (a.className = "gamemusic", n) {
            var i = document.createElement("source");
            i.type = "audio/mpeg", a.src = e, a.appendChild(i), t && a.setAttribute("autoplay", !0)
        }
        return a
    }

    function pauseMusic(e) {
        isOriginalEmbed(e) ? e.pause() : onPlayerReady(e, function(e) {
            e.pauseVideo()
        }), oMusicEmbed == e && (oMusicEmbed = void 0)
    }

    function bufferMusic(e) {
        isOriginalEmbed(e) || onPlayerReady(e, function(e) {
            e.setVolume(0), e.playVideo(), setTimeout(function() {
                e.seekTo(0, !0), e.setVolume(100), e.pauseVideo()
            }, 1e3)
        })
    }

    function stopMusic(e) {
        e && (e.permanent ? pauseMusic(e) : removeIfExists(e))
    }

    function unpauseMusic(e) {
        document.body.contains(e) && (isOriginalEmbed(e) ? e.play() : onPlayerReady(e, function(e) {
            e.playVideo()
        }), oMusicEmbed = e)
    }

    function muteSound(e) {
        isOriginalEmbed(e) ? e.muted = !0 : onPlayerReady(e, function(e) {
            e.mute()
        })
    }

    function unmuteSound(e) {
        isOriginalEmbed(e) ? e.muted = !1 : onPlayerReady(e, function(e) {
            e.unMute()
        })
    }

    function onPlayerReady(t, e) {
        try {
            t.yt ? t.tasks ? t.tasks.push(e) : e(t.yt) : (t.tasks = [e], t.yt = new YT.Player(t.id, {
                events: {
                    onReady: function() {
                        for (var e = 0; e < t.tasks.length; e++) t.tasks[e](t.yt);
                        t.tasks = void 0
                    }
                }
            }))
        } catch (e) {}
    }

    function updateMusic(e, t) {
        e != oMusicEmbed && removeIfExists(oMusicEmbed), document.body.contains(e) && (isOriginalEmbed(e) ? t && (e.volume = 1, e.currentTime = 0, e.play(), e.playbackRate = 1.2) : onPlayerReady(e, function(e) {
            t && (e.setPlaybackRate(1.25), e.seekTo(0, !0), e.setVolume(100), e.playVideo())
        }), oMusicEmbed = e)
    }

    function fastenMusic(e) {
        isOriginalEmbed(e) ? e.playbackRate = 1.2 : onPlayerReady(e, function(e) {
            e.setPlaybackRate(1.25)
        })
    }

    function shouldPlaySound(e) {
        return iSfx && kartIsPlayer(e) && !finishing && !e.loose
    }

    function shouldPlayMusic(e) {
        return bMusic && kartIsPlayer(e) && !finishing && !e.loose
    }

    function playIfShould(e, t) {
        if (shouldPlaySound(e)) return playSoundEffect(t)
    }

    function playSoundEffect(e) {
        var t = loadMusic(e, !0);
        return t.removeAttribute("loop"), t.onended = function() {
            document.body.removeChild(this)
        }, document.body.appendChild(t), t
    }

    function playDistSound(e, t, a) {
        if (iSfx) {
            var n = a / distKart(e);
            if (1 <= n) {
                var o = playSoundEffect(t);
                return o.volume = Math.min(.05 * n * n, 1), o
            }
        }
    }

    function startMusic(e, t, a) {
        var n = loadMusic(e, t);
        if (document.body.appendChild(n), a) {
            pauseMusic(n);
            var o = oMusicEmbed;
            setTimeout(function() {
                oMusicEmbed == n && (stopMusic(o), unpauseMusic(n))
            }, a), oMusicEmbed = n
        } else t && (stopMusic(oMusicEmbed), oMusicEmbed = n);
        return n
    }

    function postStartMusic(e) {
        return oMusicEmbed && fadeOutMusic(oMusicEmbed, 1, .6, !1), startMusic(e, !0, 200)
    }

    function postResumeMusic(e, t) {
        if (oMusicEmbed != e) {
            var a = oMusicEmbed;
            fadeOutMusic(a, 1, t, !0), setTimeout(function() {
                oMusicEmbed != a && oMusicEmbed || (fadeInMusic(e, .2, t), unpauseMusic(e))
            }, 500)
        }
    }

    function stopStarMusic(e) {
        shouldPlayMusic(e) && !oPlayers[1] && postResumeMusic(mapMusic, .9)
    }

    function stopMegaMusic(e) {
        shouldPlayMusic(e) && !oPlayers[1] && postResumeMusic(mapMusic, .92)
    }

    function resetPowerup(e) {
        e.etoile && (e.etoile = 0, stopStarMusic(e)), e.megachampi && (e.megachampi = 0, stopMegaMusic(e))
    }

    function isOriginalMusic(e) {
        return -1 != e.indexOf("mp3")
    }

    function isOriginalEmbed(e) {
        return "audio" == e.tagName.toLowerCase()
    }
    var willPlayEndMusic = !1,
        isEndMusicPlayed = !1,
        forceStartMusic = !1,
        forcePrepareEnding = !1,
        playingCarEngine, oMusicEmbed;

    function loadMapMusic() {
        if (startMapMusic(!1), loadEndingMusic(), mapMusic.blur(), endingMusic.blur(), !isMobile() && !isChatting()) {
            var e = document.createElement("input");
            document.body.appendChild(e), e.focus(), e.blur(), document.body.removeChild(e)
        }
    }

    function startMapMusic(e) {
        e ? updateMusic(mapMusic, !0) : ((mapMusic = startMusic(oMap.music ? "musics/maps/map" + oMap.music + ".mp3" : oMap.yt)).permanent = 1, bufferMusic(mapMusic))
    }

    function loadEndingMusic() {
        var e = getEndingSrc(strPlayer[0]);
        (endingMusic = startMusic(e)).permanent = 1, bufferMusic(endingMusic)
    }

    function loopWithoutGap() {
        if (playingCarEngine == this) {
            this.currentTime > this.duration - .44 && (this.currentTime = 0, this.play())
        }
    }

    function loopAfterIntro(e, t, a) {
        if (!e.looper) {
            var n = t + (a -= .15);
            e.looper = function() {
                this.currentTime >= n && (this.currentTime -= a)
            }, e.addEventListener("timeupdate", e.looper, !1)
        }
    }

    function startEngineSound() {
        carEngine = loadMusic("musics/events/engine.mp3", !0), carEngine2 = loadMusic("musics/events/engine2.mp3", !1), carEngine3 = loadMusic("musics/events/engine3.mp3", !1), carDrift = loadMusic("musics/events/drift.mp3", !1), carSpark = loadMusic("musics/events/spark.mp3", !1), (playingCarEngine = carEngine).addEventListener("timeupdate", loopWithoutGap, !1), carEngine2.addEventListener("timeupdate", loopWithoutGap, !1), carEngine.permanent = 1, carEngine2.permanent = 1, carEngine3.permanent = 1, carDrift.permanent = 1, carSpark.permanent = 1, document.body.appendChild(carEngine), document.body.appendChild(carEngine2), document.body.appendChild(carEngine3), document.body.appendChild(carDrift), document.body.appendChild(carSpark)
    }

    function updateEngineSound(e) {
        iSfx && e != playingCarEngine && (playingCarEngine && playingCarEngine.pause(), (playingCarEngine = e) && playingCarEngine.play())
    }

    function startEndMusic() {
        bMusic && (removeMenuMusic(!0), removeIfExists(mapMusic)), iSfx && (playingCarEngine = void 0, removeIfExists(carEngine), removeIfExists(carEngine2), removeIfExists(carEngine3), removeIfExists(carDrift), removeIfExists(carSpark)), bMusic && (willPlayEndMusic = !0, setTimeout(function() {
            for (var e = document.getElementsByClassName("gamemusic"), t = [], a = 0; a < e.length; a++) e[a].permanent || t.push(e[a]);
            for (a = 0; a < t.length; a++) document.body.removeChild(t[a]);
            willPlayEndMusic && (isEndMusicPlayed = !(willPlayEndMusic = !1), unpauseMusic(endingMusic))
        }, 200)), iSfx && "BB" != course && (playSoundEffect("musics/events/goal.mp3").className = "")
    }

    function handleEndRace() {
        (bMusic || iSfx) && startEndMusic();
        var e = ["next_circuit"];
        challengeCheck("end_game", e), challengeCheck("end_gp", e), clGlobalVars.nbcircuits++
    }

    function startGame() {
        if (resetScreen(), !isOnline)
            if ("BB" == course)
                for (var e = 0; e < aPlayers.length + strPlayer.length; e++) aPlaces[e] = e + 1;
            else "CM" == course && (aPlaces = [1]);
        var t = oMap.sections ? oMap.checkpoint.length - 1 : 0,
            a = null == oMap.startrotation ? 180 : oMap.startrotation,
            n = oMap.startdirection || 0;
        for (e = 0; e < strPlayer.length; e++) {
            var o = aPlaces[e],
                i = {
                    id: e,
                    x: oMap.startposition[0],
                    y: oMap.startposition[1],
                    z: 0,
                    personnage: strPlayer[e],
                    speed: 0,
                    speedinc: 0,
                    heightinc: 0,
                    rotation: a,
                    rotincdir: 0,
                    rotinc: 0,
                    changeView: 0,
                    size: 1,
                    sprite: new Sprite(strPlayer[e]),
                    cpu: !1,
                    aipoints: oMap.aipoints[0],
                    tourne: 0,
                    tombe: 0,
                    protect: !1,
                    roulette: 0,
                    arme: !1,
                    maxspeed: vitesse,
                    driftinc: 0,
                    driftcpt: 0,
                    drift: 0,
                    turbodrift: 0,
                    jumped: !1,
                    champi: 0,
                    etoile: 0,
                    megachampi: 0,
                    eclair: 0,
                    using: [!1]
                };
            if (isOnline && (i.id = identifiant), isOnline && (i.nick = aPseudos[e]), i.team = iTeamPlay ? aTeams[e] : -1, "BB" != course) {
                if (simplified) switch (oMap.startdirection) {
                    case -6:
                        i.x += o % 2 ? 0 : 18, i.y += 12 * o;
                        break;
                    case -1:
                        i.x += 12 * o, i.y -= o % 2 ? 0 : 18;
                        break;
                    case 6:
                        i.x -= o % 2 ? 0 : 18, i.y -= 12 * o;
                        break;
                    case 1:
                        i.x -= 12 * o, i.y += o % 2 ? 0 : 18
                } else switch (oMap.startrotation) {
                    case 270:
                        i.x += 12 * o, i.y -= o % 2 == n ? 0 : 18;
                        break;
                    case 0:
                        i.x -= o % 2 == n ? 0 : 18, i.y -= 12 * o;
                        break;
                    case 90:
                        i.x -= 12 * o, i.y += o % 2 == n ? 0 : 18;
                        break;
                    default:
                        i.x += o % 2 == n ? 0 : 18, i.y += 12 * o
                }
                i.time = 0, i.tours = 1, i.demitours = t, i.billball = 0, i.place = o
            } else {
                var r = (p = isOnline ? o - 1 : e) % oMap.startposition.length;
                i.x = oMap.startposition[r][0], i.y = oMap.startposition[r][1], i.rotation = 90 * oMap.startposition[r][2], i.loose = !1, i.ballons = [createBalloonSprite(i)], i.reserve = 4, i.place = o
            }
            i.initialPlace = i.place, oPlayers.push(i), aKarts.push(i)
        }
        for (e = 0; e < aPlayers.length; e++) {
            var l = aPlayers[e],
                s = e + strPlayer.length,
                c = (o = aPlaces[s], 2 * (iDificulty - 4) + Math.round(Math.random()));
            "BB" == course && (c = 2);
            var u = {
                id: s,
                speed: 0,
                speedinc: .5,
                heightinc: 0,
                rotation: a,
                rotincdir: 0,
                rotinc: 0,
                x: oMap.startposition[0],
                y: oMap.startposition[1],
                z: 0,
                size: 1,
                personnage: l,
                sprite: new Sprite(l),
                tourne: 0,
                tombe: 0,
                protect: !1,
                roulette: 0,
                arme: !1,
                champi: 0,
                etoile: 0,
                megachampi: 0,
                eclair: 0,
                using: [!1],
                cpu: !isOnline,
                aipoint: 0,
                aipoints: oMap.aipoints[0],
                maxspeed: 5.7
            };
            if (isOnline ? u.id = aIDs[e] : u.aipoints = oMap.aipoints[s % oMap.aipoints.length] || [], simplified) switch (oMap.startdirection) {
                case -6:
                    u.x += o % 2 ? 0 : 18, u.y += 12 * o;
                    break;
                case -1:
                    u.x += 12 * o, u.y -= o % 2 ? 0 : 18;
                    break;
                case 6:
                    u.x -= o % 2 ? 0 : 18, u.y -= 12 * o;
                    break;
                case 1:
                    u.x -= 12 * o, u.y += o % 2 ? 0 : 18
            } else switch (oMap.startrotation) {
                case 270:
                    u.x += 12 * o, u.y -= o % 2 == n ? 0 : 18;
                    break;
                case 0:
                    u.x -= o % 2 == n ? 0 : 18, u.y -= 12 * o;
                    break;
                case 90:
                    u.x -= 12 * o, u.y += o % 2 == n ? 0 : 18;
                    break;
                default:
                    u.x += o % 2 == n ? 0 : 18, u.y += 12 * o
            }
            if (isOnline && (u.nick = aPseudos[s]), u.team = iTeamPlay ? aTeams[s] : -1, -1 == u.team && !u.nick || (u.marker = createMarker(u)), "BB" != course) u.tours = 1, u.demitours = t, u.billball = 0, isOnline || (u.speed = c < 2 ? 0 : 5.7, u.tourne = c ? 0 : 42), u.place = o;
            else {
                var p;
                r = (p = isOnline ? o - 1 : s) % oMap.startposition.length;
                u.x = oMap.startposition[r][0], u.y = oMap.startposition[r][1], u.rotation = 90 * oMap.startposition[r][2], u.loose = !1, u.aipoint = oMap.startposition[r][3], simplified && (u.lastAI = oMap.startposition[r][3] + [-6, -1, 6, 1][oMap.startposition[r][2]]), u.ballons = [createBalloonSprite(u)], u.reserve = 4, u.place = p + 1, simplified || (u.speed = u.maxspeed)
            }
            u.initialPlace = u.place, aKarts.push(u)
        }
        if (oMap.decor)
            for (e = 1; e < oMap.decor.length; e++) oMap.decor[e][2] = new Sprite(oMap.decor[0]);

        function d(e) {
            this.tourne || (isOnline ? playIfShould(this, "musics/events/spin.mp3") : playDistSound(this, "musics/events/spin.mp3", "BB" == course ? 80 : 50)), this.tourne = e
        }

        function m() {
            return tombe(this.x + this.speed * direction(0, this.rotation), this.y + this.speed * direction(1, this.rotation))
        }

        function y() {
            return ralenti(Math.round(this.x + this.speed * direction(0, this.rotation)), Math.round(this.y + this.speed * direction(1, this.rotation)))
        }
        for (e = 0; e < aKarts.length; e++) aKarts[e].spin = d, aKarts[e].falling = m, aKarts[e].exiting = y;
        if ("CM" != course) {
            for (e = 0; e < oMap.arme.length; e++) oMap.arme[e][2] = 0;
            for (e = 0; e < oPlayers.length; e++) {
                document.getElementById("infoPlace" + e).innerHTML = toPlace(oPlayers[e].place), document.getElementById("infoPlace" + e).style.display = "block";
                var h = -1 != oPlayers[e].team ? oPlayers[e].team ? "#F96" : "#69F" : "";
                document.getElementById("infoPlace" + e).style.color = h, "BB" != course && (document.getElementById("compteur" + e).style.color = h)
            }
        } else {
            oMap.arme = [], aKarts[0].arme = "champi", aKarts[0].roulette = 25;
            for (e = 0; e < gPersos.length; e++) {
                var g = gPersos[e];
                aKarts.push({
                    speed: c < 2 ? 0 : 5.7,
                    speedinc: .5,
                    heightinc: 0,
                    rotation: 180,
                    rotincdir: 0,
                    rotinc: 0,
                    x: aKarts[0].x,
                    y: aKarts[0].y,
                    z: 0,
                    size: 1,
                    personnage: g,
                    sprite: new Sprite(g),
                    tourne: 0,
                    tombe: 0,
                    protect: !1,
                    roulette: 0,
                    arme: !1,
                    champi: 0,
                    etoile: 0,
                    megachampi: 0,
                    using: [!1],
                    cpu: !1,
                    aipoint: 0,
                    aipoints: oMap.aipoints[0],
                    maxspeed: 5.7,
                    place: 1
                }), aKarts[aKarts.length - 1].sprite[0].div.style.opacity = .5
            }
            document.getElementById("roulette0").innerHTML = '<img alt="."class="pixelated" src="images/items/champi.gif" style="width: ' + Math.round(8 * iScreenScale - 3) + 'px;" />'
        }
        if (gameControls = getGameControls(), challengesForCircuit = {
                end_game: [],
                each_frame: [],
                each_hit: [],
                each_kill: [],
                end_gp: []
            }, clGlobalVars = clGlobalVars || {
                nbcircuits: 0
            }, addCreationChallenges("track", getMapId(oMap)), isCup)
            if (isMCups) {
                var f = cupIDs[Math.floor((oMap.ref - 1) / 4)];
                for (var f in addCreationChallenges("cup", f), challenges.mcup) addCreationChallenges("mcup", f)
            } else
                for (var f in challenges.cup) addCreationChallenges("cup", f);
        var S = {};
        for (var b in challengesForCircuit) {
            var v = challengesForCircuit[b];
            for (e = 0; e < v.length; e++) {
                S[v[e].id] = !0
            }
        }
        for (var C in clRuleVars) S[C] || delete clRuleVars[C];
        if (reinitLocalVars(), 1 == strPlayer.length) {
            oPlanWidth = Math.round(19.4 * iScreenScale), oPlanWidth2 = oMap.w >= oMap.h ? oPlanWidth : Math.round(oPlanWidth * (oMap.w / oMap.h));
            var M = oMap.w <= oMap.h ? oPlanWidth : Math.round(oPlanWidth * (oMap.h / oMap.w));
            if (oPlanSize = 59 * iScreenScale, oPlanSize2 = oPlanWidth2, oPlanRealSize = oMap.w, oCharRatio = .8, oPlanRatio = .5, (oPlanDiv = document.createElement("div")).style.backgroundColor = "rgb(" + oMap.bgcolor + ")", oPlanDiv.style.position = "absolute", oPlanDiv.style.left = 15 + iScreenScale * iWidth + "px", oPlanDiv.style.top = "9px", oPlanDiv.style.width = oPlanWidth + "px", oPlanDiv.style.height = oPlanWidth + "px", oPlanDiv.style.overflow = "hidden", (oPlanDiv2 = document.createElement("div")).style.backgroundColor = "rgb(" + oMap.bgcolor + ")", oPlanDiv2.style.position = "absolute", oPlanDiv2.style.left = 15 + iScreenScale * iWidth + "px", oPlanDiv2.style.top = 10 + Math.round(iScreenScale / 4) + oPlanWidth + "px", oPlanDiv2.style.width = oPlanWidth + "px", oPlanDiv2.style.height = oPlanWidth + "px", oPlanDiv2.style.overflow = "hidden", (oPlanCtn = document.createElement("div")).style.position = "absolute", oPlanCtn.style.transformOrigin = oPlanCtn.style.WebkitTransformOrigin = oPlanCtn.style.MozTransformOrigin = "left", (oPlanCtn2 = document.createElement("div")).style.position = "absolute", oPlanCtn2.style.left = Math.round((oPlanWidth - oPlanWidth2) / 2) + "px", oPlanCtn2.style.top = Math.round((oPlanWidth - M) / 2) + "px", oPlanCtn2.style.width = oPlanWidth2 + "px", oPlanCtn2.style.height = M + "px", (oPlanImg = document.createElement("img")).src = oMapImg.src, oPlanImg.style.position = "absolute", oPlanImg.style.left = "0px", oPlanImg.style.top = "0px", oPlanImg.style.width = oPlanSize + "px", oPlanCtn.appendChild(oPlanImg), (oPlanImg2 = document.createElement("img")).src = oMapImg.src, oPlanImg2.style.position = "absolute", oPlanImg2.style.left = "0px", oPlanImg2.style.top = "0px", oPlanImg2.style.width = oPlanWidth2 + "px", oPlanCtn2.appendChild(oPlanImg2), oCharWidth = 2 * iScreenScale, oTeamWidth = Math.round(2.4 * iScreenScale), oBBWidth = 2 * iScreenScale, oStarWidth2 = Math.round(1.5 * iScreenScale), oObjWidth = Math.round(1.5 * iScreenScale), oExpWidth = 7 * iScreenScale, oCharWidth2 = Math.round(oCharRatio * oCharWidth), oTeamWidth2 = Math.round(oCharRatio * oTeamWidth), oBBWidth2 = Math.round(oCharRatio * oBBWidth), oObjWidth2 = Math.round(oPlanRatio * oObjWidth), oExpWidth2 = Math.round(oPlanRatio * oExpWidth), iTeamPlay)
                for (e = 0; e < aTeams.length; e++) {
                    var x = document.createElement("div");
                    x.style.position = "absolute", x.style.zIndex = 1, x.style.width = oTeamWidth + "px", x.style.height = oTeamWidth + "px", x.style.borderRadius = Math.round(oTeamWidth / 2) + "px", x.style.opacity = .5, x.style.backgroundColor = aTeams[e] ? "red" : "blue", oPlanTeams.push(x), oPlanCtn.appendChild(x);
                    var P = document.createElement("div");
                    P.style.position = "absolute", P.style.zIndex = 1, P.style.width = oTeamWidth2 + "px", P.style.height = oTeamWidth2 + "px", P.style.borderRadius = Math.round(oTeamWidth2 / 2) + "px", P.style.opacity = .5, P.style.backgroundColor = aTeams[e] ? "red" : "blue", oPlanTeams2.push(P), oPlanCtn2.appendChild(P)
                }
            for (e = 0; e < aKarts.length; e++) {
                var k = document.createElement("img");
                k.style.position = "absolute", k.style.zIndex = 1, k.style.width = oCharWidth + "px", k.src = getMapIcSrc(aKarts[e].personnage), k.className = "pixelated", oPlanCharacters.push(k);
                var E = document.createElement("img");
                E.style.position = "absolute", E.style.zIndex = 1, E.style.width = oCharWidth2 + "px", E.src = getMapIcSrc(aKarts[e].personnage), E.className = "pixelated", oPlanCharacters2.push(E)
            }
            if ("CM" == course && 1 < oPlanCharacters.length) {
                for (e = 0; e < oPlanCharacters.length; e++) oPlanCtn.appendChild(oPlanCharacters[e]);
                for (e = 0; e < oPlanCharacters2.length; e++) oPlanCtn2.appendChild(oPlanCharacters2[e]);
                oPlanCharacters[1].style.opacity = .5, oPlanCharacters2[1].style.opacity = .5
            } else {
                for (e = oPlanCharacters.length - 1; 0 <= e; e--) oPlanCtn.appendChild(oPlanCharacters[e]);
                for (e = oPlanCharacters2.length - 1; 0 <= e; e--) oPlanCtn2.appendChild(oPlanCharacters2[e])
            }
            for (e = 0; e < oMap.arme.length; e++) {
                fSprite = oMap.arme[e], fSprite[2] = new Sprite("objet");
                var I = document.createElement("img");
                I.src = "images/map_icons/objet.png", I.style.position = "absolute", I.style.display = "none", I.style.width = oObjWidth, I.className = "pixelated", posImg(I, fSprite[0], fSprite[1], Math.round(i.rotation), oObjWidth, oPlanSize), oPlanCtn.appendChild(I), oPlanObjects.push(I);
                var T = document.createElement("img");
                T.src = "images/map_icons/objet.png", T.style.position = "absolute", T.style.display = "none", T.style.width = oObjWidth2, T.className = "pixelated", posImg(T, fSprite[0], fSprite[1], Math.round(i.rotation), oObjWidth2, oPlanSize2), oPlanCtn2.appendChild(T), oPlanObjects2.push(T)
            }
            oPlanDiv.appendChild(oPlanCtn), document.body.appendChild(oPlanDiv), oPlanDiv2.appendChild(oPlanCtn2), document.body.appendChild(oPlanDiv2), setPlanPos()
        }
        if (setTimeout(render, 500), bMusic) {
            var w = playSoundEffect("musics/events/" + ("BB" != course ? "start" : "startbb") + ".mp3");
            w.pause(), setTimeout(function() {
                w.play()
            }, 300), w.blur()
        }
        bCounting = !0;
        var B = new Array;
        for (e = 0; e < strPlayer.length; e++) B[e] = [document.createElement("div"), new Image], B[e][0].style.position = "absolute", B[e][0].style.width = 12 * iScreenScale + "px", B[e][0].style.height = 12 * iScreenScale + "px", B[e][0].style.overflow = "hidden", B[e][0].style.top = 4 * iScreenScale + "px", B[e][0].style.left = 8 * iScreenScale + "px", B[e][1].src = "images/lakitu_depart.png", B[e][1].style.position = "absolute", B[e][1].style.left = "0px", B[e][1].height = 12 * iScreenScale, B[e][1].className = "pixelated", B[e][0].appendChild(B[e][1]), oContainers[e].appendChild(B[e][0]), B[e].scrollLeft = 0;
        var L, z, D = 0;
        if ((bMusic || iSfx) && ((L = loadMusic("musics/events/countdown.mp3")).removeAttribute("loop"), document.body.appendChild(L), (z = loadMusic("musics/events/go.mp3")).removeAttribute("loop"), document.body.appendChild(z), z.blur(), !isMobile() && !isChatting())) {
            var H = document.createElement("input");
            document.body.appendChild(H), H.focus(), H.blur(), document.body.removeChild(H)
        }
        var O = fInfos && fInfos.replay,
            R = function() {
                if (D) {
                    for (var c = 0; c < strPlayer.length; c++) B[c][0].scrollLeft = 12 * D * iScreenScale;
                    if (!(D < 3)) {
                        for (c = 0; c < strPlayer.length; c++) document.getElementById("infos" + c).innerHTML = "<tr><td>" + toLanguage("&nbsp; &nbsp; GO !", "PARTEZ !") + "</td></tr>", document.getElementById("infos" + c).style.left = 10 + 20 * iScreenScale + c * (iWidth * iScreenScale + 2) + "px", document.getElementById("infos" + c).style.fontSize = 8 * iScreenScale + "pt", 1 == oPlayers[c].speed ? oPlayers[c].speed = 11 : 1 < oPlayers[c].speed && (oPlayers[c].spin(42), oPlayers[c].speed = 0, oPlayers[c].speedinc = 0);
                        if (!isOnline && "BB" == course)
                            for (c = strPlayer.length; c < aKarts.length; c++) {
                                var e = aKarts[c],
                                    t = 1 + Math.round(Math.random());
                                for (j = 0; j < t; j++) addNewBalloon(e), e.reserve--
                            }
                        if ((bMusic || iSfx) && (z.play(), z.onended = function() {
                                document.body.removeChild(L), document.body.removeChild(z)
                            }), forcePrepareEnding = !0, setTimeout(function() {
                                for (var e = kartIsPlayer(oPlayers[0]) && !oPlayers[0].loose && !finishing || O, t = 0; t < strPlayer.length; t++) oContainers[t].removeChild(B[t][0]), (e || t) && (document.getElementById("infos" + t).style.visibility = "hidden");
                                e && (document.getElementById("infos0").style.top = 7 * iScreenScale + 10 + "px", document.getElementById("infos0").style.left = Math.round(25 * iScreenScale + 10 + (strPlayer.length - 1) / 2 * (iWidth * iScreenScale + 2)) + "px", document.getElementById("infos0").style.fontSize = 4 * iScreenScale + "pt", document.getElementById("infos0").innerHTML = '<tr><td><input type="button" style="font-size: ' + 3 * iScreenScale + 'pt; width: 100%;" value=" &nbsp; ' + toLanguage("  RESUME  ", "REPRENDRE") + ' &nbsp; " id="reprendre" /></td></tr><tr><td' + ("CM" != course ? ' style="font-size: ' + 10 * iScreenScale + 'px;">&nbsp;' : ' style="font-size: ' + 2 * iScreenScale + 'px">&nbsp;</td></tr><tr><td><input type="button" id="recommencer" value=" &nbsp; ' + toLanguage("RETRY", "R&Eacute;&Eacute;SSAYER") + ' &nbsp; " style="font-size: ' + 3 * iScreenScale + 'pt; width: 100%;" /></td></tr><tr><td style="font-size: ' + 2 * iScreenScale + 'px">&nbsp;') + '</td></tr><tr><td><input type="button" id="quitter" value=" &nbsp; ' + toLanguage("QUIT", "QUITTER") + ' &nbsp; " style="font-size: ' + 3 * iScreenScale + 'pt; width: 100%;" /></td></tr>', document.getElementById("reprendre").onclick = reprendre, "CM" == course && (document.getElementById("recommencer").onclick = function() {
                                    pause = !0, removeGameMusics(), oContainers[0].innerHTML = "", document.getElementById("compteur0").innerHTML = "", document.getElementById("temps0").innerHTML = "", document.getElementById("objet0").style.visibility = "hidden", fInfos = {
                                        player: strPlayer,
                                        map: oMap.ref,
                                        difficulty: iDificulty,
                                        perso: gPersos,
                                        cpu_route: jTrajets,
                                        record: gRecord
                                    }, document.getElementById("infos0").style.visibility = "hidden", document.getElementById("infos0").style.opacity = .8, document.getElementById("infos0").style.color = "#FF9900", document.getElementById("infos0").style.fontFamily = "", document.getElementById("lakitu0").style.display = "none", document.getElementById("drift0").style.display = "none", 1 == strPlayer.length && removePlan(), oBgLayers.length = 0, document.onmousedown = void 0, setTimeout(MarioKart, 500)
                                }), document.getElementById("quitter").onclick = quitter, bMusic && !oMusicEmbed && (unpauseMusic(mapMusic), forceStartMusic = !0)), bCounting = !1
                            }, 1e3), pause && fInfos.replay) {
                            var f = [iTrajet],
                                S = pause = !1,
                                b = 0,
                                v = 0,
                                C = null,
                                M = !1,
                                x = !1;

                            function P() {
                                getDriftImg(aKarts[0].tourne = 0).src = "images/drift.png", document.getElementById("drift0").style.display = "none", v = 0
                            }

                            function k() {
                                x && (x = !1, aKarts[0].tourne = 0);
                                var e = aKarts[0].sprite[0];
                                e.div.ahallowed && (e.div.ahallowed = !1, e.div.style.backgroundColor = "", e.div.style.backgroundImage = "", e.div.style.backgroundRepeat = "", e.div.style.backgroundSize = "", e.img.style.opacity = 1)
                            }

                            function E(e, t) {
                                var a = t - e;
                                return a - 360 * Math.round(a / 360)
                            }

                            function I(e) {
                                return Math.sqrt(Math.abs(e) / .7) * Math.sign(e)
                            }

                            function T(e) {
                                for (var t = Math.min(e + 50, f[c].length), a = f[0], n = e + 1; n < t; n++) {
                                    if (a[n][3]) return -1;
                                    var o = a[n - 1][0],
                                        i = a[n - 1][1],
                                        r = a[n][0],
                                        l = a[n][1],
                                        s = (r - o) * (r - o) + (l - i) * (l - i);
                                    if (Math.abs(64 - s) < .16) return n - e;
                                    if (100 < s) return -1
                                }
                                return -1
                            }
                            for (c = 0; c < aKarts.length; c++) aKarts[c].cpu = !0;
                            for (c = 0; c < gPersos.length; c++) f.push(jTrajets[c]);
                            ! function e() {
                                if (!pause) {
                                    for (var t = 0; t < f.length; t++) {
                                        var a = aKarts[t],
                                            n = f[t][timer];
                                        if (n) {
                                            a.tombe && (a.tombe--, a.tombe || (a.sprite[0].img.style.display = "block"), t || (oContainers[0].style.opacity = Math.abs(a.tombe - 10) / 10));
                                            var o = a.rotation;
                                            if (a.x = n[0], a.y = n[1], a.rotation = n[2], n[3]) {
                                                if (t || (S = !0, x || P()), a.z = n[3], !t && (1.18 < a.z && (S = !1), S && a.z < b)) {
                                                    S = !1;
                                                    for (var i = a.rotation, r = timer + 1; r < f[t].length; r++) {
                                                        var l = f[t][r];
                                                        if (!l[3]) {
                                                            var s = E(i, l[2]);
                                                            .01 < Math.abs(s) && (M = !0, a.tourne = 0 < s ? 19 : 2);
                                                            break
                                                        }
                                                        i = l[2]
                                                    }
                                                }
                                                n[4] && (a.tombe = 20, a.sprite[0].img.style.display = "none")
                                            } else if (M) {
                                                if (!t) {
                                                    M = S = !1, v = 1;
                                                    var c = T(timer);
                                                    if (-1 != c)
                                                        if (1 == c) v = 5;
                                                        else {
                                                            var u = 15 - c;
                                                            0 < u && u <= 5 && (v = u)
                                                        } document.getElementById("drift0").style.display = "block"
                                                }
                                            } else if (v && !t) {
                                                var p = a.rotation - o;
                                                p -= 360 * Math.round(p / 360), 15 == v && (getDriftImg(0).src = "images/turbo-drift.png"), y = a.rotation, h = o, g = .01, Math.abs(E(y, h)) > g || 0 < T(timer) ? v++ : P()
                                            }
                                            if (n[3] || (a.z = 0), !t) {
                                                if (null != C)
                                                    if (a.z)
                                                        if (x) {
                                                            if (a.tourne -= 1 + Math.round(.5 * (11 - Math.abs(11 - a.tourne))), a.tourne < 8) {
                                                                var d = a.sprite[0];
                                                                d.div.ahallowed || (d.div.ahallowed = !0, d.div.style.backgroundImage = "url('images/halo.png')", d.div.style.backgroundRepeat = "no-repeat", d.div.style.backgroundSize = "contain", d.img.style.opacity = .7), a.tourne < 0 && (a.tourne = 0)
                                                            }
                                                        } else {
                                                            C -= .5;
                                                            var m = I(a.z - b);
                                                            .01 < m - C && (x = !0, P(), a.tourne = 19), C = m
                                                        }
                                                else k(), C = null;
                                                else b && (C = I(a.z - b));
                                                b = a.z
                                            }
                                        } else null == a.aipoint && (a.aipoint = 0, a.arme = !1, a.maxspeed = 5.7, t || (a.tourne = 0, P(), k())), ai(a), move(t)
                                    }
                                    var y, h, g;
                                    timer++, showTimer(), timer % 100 || (aKarts[0].changeView = Math.floor(21 * Math.random()) * (360 / 21)), setTimeout(timer != iTrajet.length ? e : function() {
                                        var e = aKarts[0];
                                        e.aipoint = 0, e.changeView = 180, e.maxspeed = 5.7, e.speed = 5.7, e.tourne = 0, P(), k(), document.onkeyup = void 0, document.getElementById("infos0").style.visibility = "visible", (bMusic || iSfx) && startEndMusic(), cycle()
                                    }, 67), render()
                                }
                            }(), pause = !1, setTimeout(continuer, 1e3), document.onkeyup = function(e) {
                                var t = gameControls[e.keyCode];
                                "pause" != t || bCounting ? "quit" == t && quitter() : document.getElementById("infos0").style.visibility = "hidden" == document.getElementById("infos0").style.visibility ? "visible" : "hidden"
                            }
                        } else document.onkeydown = function(e) {
                            if (forceStartMusic) try {
                                mapMusic.yt && mapMusic.yt.playVideo(), forceStartMusic = !1
                            } catch (e) {} else if (forcePrepareEnding) try {
                                endingMusic.yt && (endingMusic.yt.setVolume(0), endingMusic.yt.playVideo(), setTimeout(function() {
                                    endingMusic.yt.seekTo(0, !0), endingMusic.yt.setVolume(100), endingMusic.yt.pauseVideo()
                                }, 1e3)), forcePrepareEnding = !1
                            } catch (e) {}
                            if (!clLocalVars.fastForward) {
                                var t = gameControls[e.keyCode];
                                if (t) {
                                    var a = document.activeElement;
                                    if (!a || "INPUT" != a.tagName || "button" == a.type || "submit" == a.type) switch (e.preventDefault && e.preventDefault(), t) {
                                        case "up":
                                            oPlayers[0].speedinc = cp[oPlayers[0].personnage][0] * oPlayers[0].size, oPlayers[0].etoile && (oPlayers[0].speedinc *= 5);
                                            break;
                                        case "left":
                                            oPlayers[0].rotincdir = cp[oPlayers[0].personnage][2], oPlayers[0].driftinc || oPlayers[0].tourne || oPlayers[0].fell || !oPlayers[0].ctrl || (oPlayers[0].jumped && (oPlayers[0].driftinc = 1), oPlayers[0].driftinc && (clLocalVars.drifted = !0));
                                            break;
                                        case "right":
                                            oPlayers[0].rotincdir = -cp[oPlayers[0].personnage][2], oPlayers[0].driftinc || oPlayers[0].tourne || oPlayers[0].fell || !oPlayers[0].ctrl || (oPlayers[0].jumped && (oPlayers[0].driftinc = -1), oPlayers[0].driftinc && (clLocalVars.drifted = !0));
                                            break;
                                        case "down":
                                            oPlayers[0].speedinc -= .2;
                                            break;
                                        case "jump":
                                            if (pause) break;
                                            oPlayers[0].ctrl = !0, oPlayers[0].z || oPlayers[0].heightinc ? oPlayers[0].jumped || oPlayers[0].fell || oPlayers[0].ctrled || oPlayers[0].billball || oPlayers[0].tourne || oPlayers[0].figuring || oPlayers[0].figstate || stuntKart(oPlayers[0]) : oPlayers[0].driftinc || oPlayers[0].tourne || (oPlayers[0].z = 1, oPlayers[0].heightinc = .5, oPlayers[0].jumped = !0, oPlayers[0].rotincdir && (oPlayers[0].driftinc = 0 < oPlayers[0].rotincdir ? 1 : -1), oPlayers[0].driftinc && (clLocalVars.drifted = !0));
                                            break;
                                        case "pause":
                                            if (isOnline) break;
                                            pause ? reprendre(!0) : bCounting || (document.getElementById("infos0").style.visibility = "visible", pause = !0, pauseSounds());
                                            break;
                                        case "balloon":
                                            if (pause) return;
                                            if ("BB" == course && oPlayers[0].tourne < 5 && oPlayers[0].reserve && oPlayers[0].ballons.length < 3 && !oPlayers[0].sprite[0].div.style.opacity) {
                                                for (oPlayers[0].ballons[oPlayers[0].ballons.length] = createBalloonSprite(oPlayers[0]), oPlayers[0].reserve--, document.getElementById("compteur0").innerHTML = "&nbsp;", c = 0; c < oPlayers[0].reserve; c++) document.getElementById("compteur0").innerHTML += '<img src="' + balloonSrc(oPlayers[0].team) + '" style="width: ' + 2 * iScreenScale + '" />';
                                                playIfShould(oPlayers[0], "musics/events/balloon.mp3")
                                            }
                                            break;
                                        case "quit":
                                            bCounting || quitter();
                                            break;
                                        case "cheat":
                                            isOnline || "GP" == course || "CM" == course || openCheats();
                                            break;
                                        case "fastfwd":
                                            if (clLocalVars.delayedStart && !clLocalVars.cheated && !pause)
                                                if (clLocalVars.startedAt) alert(language ? "You have already started, it's too late..." : "Vous avez déjà démarré, il est trop tard...");
                                                else {
                                                    var n = 1e3 * clLocalVars.delayedStart / 67;
                                                    if (timer < n) {
                                                        pause = !0, clLocalVars.fastForward = !0;
                                                        var o = reprendre;
                                                        reprendre = function() {},
                                                            function e() {
                                                                pause && (timer < n ? (setTimeout(e, 1), runOneFrame()) : (delete clLocalVars.fastForward, (reprendre = o)(!1)))
                                                            }()
                                                    }
                                                } break;
                                        case "up_p2":
                                            if (!oPlayers[1]) return;
                                            oPlayers[1].speedinc = cp[oPlayers[1].personnage][0] * oPlayers[1].size, oPlayers[1].etoile && (oPlayers[1].speedinc *= 5);
                                            break;
                                        case "left_p2":
                                            if (!oPlayers[1]) return;
                                            oPlayers[1].rotincdir = cp[oPlayers[1].personnage][2], oPlayers[1].driftinc || oPlayers[1].tourne || oPlayers[1].fell || !oPlayers[1].ctrl || oPlayers[1].jumped && (oPlayers[1].driftinc = 1);
                                            break;
                                        case "right_p2":
                                            if (!oPlayers[1]) return;
                                            oPlayers[1].rotincdir = -cp[oPlayers[1].personnage][2], oPlayers[1].driftinc || oPlayers[1].tourne || oPlayers[1].fell || !oPlayers[1].ctrl || oPlayers[1].jumped && (oPlayers[1].driftinc = -1);
                                            break;
                                        case "down_p2":
                                            if (!oPlayers[1]) return;
                                            oPlayers[1].speedinc -= .2;
                                            break;
                                        case "jump_p2":
                                            if (pause) break;
                                            if (!oPlayers[1]) return;
                                            return oPlayers[1].ctrl = !0, oPlayers[1].z || oPlayers[1].heightinc ? oPlayers[1].jumped || oPlayers[1].ctrled || oPlayers[1].fell || oPlayers[1].billball || oPlayers[1].tourne || oPlayers[1].figuring || oPlayers[1].figstate || stuntKart(oPlayers[1]) : oPlayers[1].driftinc || oPlayers[1].tourne || (oPlayers[1].z = 1, oPlayers[1].heightinc = .5, oPlayers[1].jumped = !0, oPlayers[1].rotincdir && (oPlayers[1].driftinc = 0 < oPlayers[1].rotincdir ? 1 : -1)), !1;
                                        case "rear_p2":
                                            if (pause) return;
                                            if (!oPlayers[1]) return;
                                            if ("BB" == course && oPlayers[0].tourne < 5 && oPlayers[1].reserve && oPlayers[1].ballons.length < 3 && !oPlayers[1].sprite[0].div.style.opacity)
                                                for (oPlayers[1].ballons[oPlayers[1].ballons.length] = createBalloonSprite(oPlayers[1]), oPlayers[1].reserve--, document.getElementById("compteur1").innerHTML = "&nbsp;", c = 0; c < oPlayers[1].reserve; c++) document.getElementById("compteur1").innerHTML += '<img src="' + balloonSrc(oPlayers[1].team) + '" style="width: ' + 2 * iScreenScale + '" />'
                                    }
                                }
                            }
                        }, document.onkeyup = function(e) {
                            var t = gameControls[e.keyCode];
                            if (t) {
                                var a = document.activeElement;
                                if (!a || "INPUT" != a.tagName || "button" == a.type || "submit" == a.type) switch (t) {
                                    case "item":
                                    case "item_back":
                                        oPlayers[0].tourne || pause || arme(0, "item_back" === t);
                                        break;
                                    case "up":
                                        oPlayers[0].speedinc = 0;
                                        break;
                                    case "left":
                                    case "right":
                                        oPlayers[0].rotincdir = 0;
                                        break;
                                    case "down":
                                        oPlayers[0].speedinc = 0;
                                        break;
                                    case "jump":
                                        if (pause) break;
                                        delete oPlayers[0].ctrl, oPlayers[0].driftinc && (oPlayers[0].driftinc = 0, 15 <= oPlayers[0].driftcpt && (oPlayers[0].turbodrift = 15, getDriftImg(0).src = "images/drift.png"), oPlayers[0].driftcpt = 0, document.getElementById("drift0").style.display = "none", oPlayers[0].driftSound && (oPlayers[0].driftSound.pause(), oPlayers[0].driftSound = void 0)), oPlayers[0].ctrled = !1, oPlayers[0].jumped && (oPlayers[0].z || oPlayers[0].heightinc) && (oPlayers[0].ctrled = !0);
                                        break;
                                    case "rear":
                                        if (!bCounting) {
                                            var n = 180 - oPlayers[0].changeView;
                                            oPlayers[0].changeView = n, oPlayers[0].sprite[0].setState(11)
                                        }
                                        break;
                                    case "item_p2":
                                    case "item_back_p2":
                                        oPlayers[1].tourne || pause || arme(1, "item_back_p2" === t);
                                        break;
                                    case "up_p2":
                                        if (!oPlayers[1]) return;
                                        oPlayers[1].speedinc = 0;
                                        break;
                                    case "left_p2":
                                    case "right_p2":
                                        if (!oPlayers[1]) return;
                                        oPlayers[1].rotincdir = 0;
                                        break;
                                    case "down_p2":
                                        if (!oPlayers[1]) return;
                                        oPlayers[1].speedinc = 0;
                                        break;
                                    case "jump_p2":
                                        if (pause) break;
                                        if (!oPlayers[1]) return;
                                        delete oPlayers[1].ctrl, oPlayers[1].driftinc && (oPlayers[1].driftinc = 0, 15 <= oPlayers[1].driftcpt && (oPlayers[1].turbodrift = 15, getDriftImg(1).src = "images/drift.png"), oPlayers[1].driftcpt = 0, document.getElementById("drift1").style.display = "none", oPlayers[1].driftSound && (oPlayers[1].driftSound.pause(), oPlayers[1].driftSound = void 0)), oPlayers[1].ctrled = !1, oPlayers[1].jumped && (oPlayers[1].z || oPlayers[1].heightinc) && (oPlayers[1].ctrled = !0);
                                        break;
                                    case "rear_p2":
                                        if (!oPlayers[1]) return;
                                        if (!bCounting) {
                                            n = 180 - oPlayers[1].changeView;
                                            oPlayers[1].changeView = n, oPlayers[1].sprite[0].setState(11)
                                        }
                                }
                            }
                        }, window.releaseOnBlur = function() {
                            for (var e = 0; e < oPlayers.length; e++) oPlayers[e].speedinc = 0, oPlayers[e].rotincdir = 0, stopDrifting(e)
                        }, window.addEventListener("blur", window.releaseOnBlur), isMobile() && (document.onmousedown = function(e) {
                            return !!pause || (!!oPlayers[0].tourne || ("BB" == course ? (document.onkeydown({
                                keyCode: findKeyCode("balloon")
                            }), !1) : !oPlayers[0].arme && !oPlayers[0].using[0] || (arme(0), !1)))
                        }), isOnline && (window.onbeforeunload = function() {
                            return language ? "Caution, if you leave the game, you are considered loser" : "Attention, si vous quittez la partie, vous êtes considéré comme perdant"
                        }), pause = !1, "CM" == course && (iTrajet = new Array), cycle(), bRunning = !0;
                        return void(fInfos = void 0)
                    }
                    for (var c = 0; c < strPlayer.length; c++) document.getElementById("decompte" + c).innerHTML--, oPlayers[c].speed += oPlayers[c].speedinc;
                    (bMusic || iSfx) && (L.currentTime = 0, L.play())
                } else {
                    for (c = 0; c < strPlayer.length; c++) document.getElementById("infos" + c).style.visibility = "visible";
                    (bMusic || iSfx) && L.play(), document.body.style.cursor = "default"
                }
                D++, setTimeout(R, 1e3)
            };
        if (iSfx && setTimeout(startEngineSound, bMusic ? 2600 : 1100), isOnline) {
            var A = tnCourse - (new Date).getTime();
            setTimeout(R, A), iTeamPlay && function(e) {
                var t = oPlayers[0].team,
                    a = document.createElement("div");
                a.style.position = "absolute", a.style.zIndex = 1e4, a.style.left = "0px", a.style.top = 12 * iScreenScale + "px", a.style.width = iScreenScale * iWidth + "px", a.style.textAlign = "center", a.style.fontSize = 6 * iScreenScale + "px", a.style.fontWeight = "bold", a.style.color = t ? "#F96" : "#69F", a.innerHTML = toLanguage("You are ", "Vous êtes ") + (t ? toLanguage("red", "rouge") : toLanguage("blue", "bleu"));
                var n = Math.min(1500, e - 1e3);
                500 < n && setTimeout(function() {
                    oContainers[0].appendChild(a), setTimeout(function() {
                        oContainers[0].removeChild(a)
                    }, n)
                }, 500)
            }(A)
        } else setTimeout(R, bMusic ? 3e3 : 1500);
        isOnline || (document.body.style.cursor = "default")
    }

    function youtube_parser(e) {
        var t = e.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
        return !(!t || 11 != t[1].length) && t[1]
    }
    var fSpriteScale = 0,
        fLineScale = 0,
        oContainers = [document.createElement("div")];
    oContainers[0].tabindex = 1, oContainers[0].style.position = "absolute", oContainers[0].style.border = "2px solid black", oContainers[0].style.left = "10px", oContainers[0].style.overflow = "hidden", document.getElementById("mariokartcontainer").appendChild(oContainers[0]), pause && fInfos.player[1] && (oContainers[1] = oContainers[0].cloneNode(!1), oContainers[1].style.left = 10 + iWidth * iScreenScale + "px", document.getElementById("mariokartcontainer").appendChild(oContainers[1]));
    var oScreens = new Array,
        aStrips = new Array,
        iCamHeight = 24,
        iCamDist = 32,
        iViewHeight = -10,
        iViewDist = 0,
        fFocal = 1 / Math.tan(Math.PI * Math.PI / 360);

    function resetScreen() {
        fSpriteScale = iScreenScale / 4, fLineScale = 1 / iScreenScale * iQuality, aStrips = [];
        for (var e = 0; e < strPlayer.length; e++) {
            var t = oContainers[e];
            t.style.width = iWidth * iScreenScale + "px", t.style.height = iHeight * iScreenScale + "px", t.style.left = 10 + iWidth * iScreenScale * e + "px";
            var a = document.createElement("canvas");
            a.style.position = "absolute", oScreens.push(a), oContainers[e].appendChild(a), a.width = iWidth / fLineScale, a.height = iHeight / fLineScale, a.style.width = iWidth * iScreenScale + iScreenScale + "px", a.style.left = -iScreenScale / 2 + "px", a.style.top = iScreenScale + "px", a.style.height = iHeight * iScreenScale + "px"
        }
        for (e = 0; e < oBgLayers.length; e++) oBgLayers[e].suppr();
        for (var n = 0, o = 0; o < iHeight; o += fLineScale) {
            var i = o + iViewHeight,
                r = i / ((iCamHeight - i) / iCamDist),
                l = fFocal / (fFocal + r),
                s = Math.floor(iWidth / l);
            if (0 < l && s < iViewCanvasWidth) 0 == o && (n = r - 1), aStrips.push({
                viewy: o,
                mapz: r,
                scale: l,
                stripwidth: s,
                mapzspan: r - n
            }), n = r
        }
        for (e = 0; e < oMap.fond.length; e++) oBgLayers[e] = new BGLayer(oMap.fond[e], 2 == oMap.fond.length ? 1 : e + 1);
        (oViewCanvas = document.createElement("canvas")).width = iViewCanvasWidth, oViewCanvas.height = iViewCanvasHeight
    }

    function reprendre(e) {
        setTimeout(function() {
            pause && (pause = !1, cycle())
        }, 67), e && (unpauseSounds(), document.getElementById("infos0").style.visibility = "hidden")
    }

    function quitter() {
        if (isOnline) document.location.href = isMCups ? (complete ? "map" : "circuit") + ".php?mid=" + nid : isCup ? complete ? (isBattle ? "battle" : "map") + ".php?" + (isSingle ? "i" : "cid") + "=" + nid : (isBattle ? "arena" : "circuit") + ".php?" + (isSingle ? "id" : "cid") + "=" + nid : "index.php";
        else {
            pause = !0, displayCommands("&nbsp;"), removeGameMusics();
            for (var e = 0; e < strPlayer.length; e++) {
                oContainers[e].innerHTML = "", document.getElementById("infos" + e).style.visibility = "hidden", document.getElementById("infoPlace" + e).style.display = "none", document.getElementById("infoPlace" + e).innerHTML = "", document.getElementById("compteur" + e).innerHTML = "", document.getElementById("temps" + e).innerHTML = "", document.getElementById("objet" + e).style.visibility = "hidden", document.getElementById("roulette" + e).innerHTML = "";
                var t = document.getElementById("lakitu" + e);
                t && (t.style.display = "none"), document.getElementById("drift" + e).style.display = "none", document.getElementById("infos" + e).style.opacity = .8, document.getElementById("infos" + e).style.color = "#FF9900", document.getElementById("scroller" + e).style.visibility = "hidden"
            }(document.getElementById("mariokartcontainer").style.opacity = 1) == strPlayer.length && removePlan(), document.onmousedown = void 0, document.onkeydown = void 0, document.onkeyup = void 0, window.removeEventListener("blur", window.releaseOnBlur), window.releaseOnBlur = void 0, oBgLayers.length = 0, aPlayers = [], aScores = [], clRuleVars = {}, clGlobalVars = void 0, setTimeout(function() {
                pause = !1, MarioKart()
            }, 500)
        }
    }

    function classement() {
        for (var e = aKarts.length, t = 0; t < e; t++) {
            for (var a = aKarts[t], n = aScores[t], o = 1, i = 0; i < e; i++) {
                var r = aScores[i];
                a != aKarts[i] && n <= r && (n < r || i < t) && o++
            }
            a.place = o
        }
        var l = new Array;
        for (t = 1; t <= e; t++)
            for (i = 0; i < e; i++) {
                (o = aKarts[i].place) == t && (l.push(i), i = e)
            }
        document.getElementById("infos0").style.visibility = "hidden";
        var s, c = strPlayer.length - 1;
        for (t = 0; t < l.length; t++) {
            var u = l[t],
                p = aKarts[u].personnage,
                d = 1 == aKarts[u].team ? 1 : 0;
            document.getElementById("fJ" + t).style.backgroundColor = 0 != u ? u != c ? d ? "red" : "" : d ? "brown" : "navy" : rankingColor(aKarts[u].team), document.getElementById("fJ" + t).style.opacity = p != strPlayer ? "" : .8, document.getElementById("j" + t).innerHTML = toPerso(p), document.getElementById("pts" + t).innerHTML = aScores[u]
        }
        if (iTeamPlay) {
            var m = [0, 0];
            for (t = 0; t < aScores.length; t++) m[aTeams[t]] += aScores[t];
            var y = m[0] > m[1] || m[0] == m[1] && m[0] == oPlayers[0].team ? [0, 1] : [1, 0];
            (s = document.createElement("table")).id = "team-table";
            var h = '<tr style="font-size: ' + 2 * iScreenScale + 'px; background-color: white; color: black;"><td>Places</td><td>' + toLanguage("Team", "Équipe") + "</td><td>Pts</td></tr>";
            for (t = 0; t < y.length; t++) {
                h += '<tr id="fJ' + t + '" style="background-color:' + ((d = y[t]) ? "red" : "blue") + '"><td>' + toPlace(t + 1) + ' </td><td class="maj" id="j' + t + '">' + (d ? toLanguage("Red", "Rouge") : toLanguage("Blue", "Bleue")) + '</td><td id="pts' + t + '">' + m[d] + "</td></tr>"
            }
            s.style.visibility = "hidden", s.style.position = "absolute", s.style.zIndex = 2e4, s.style.left = 3 * iScreenScale + 10 + "px", s.style.top = 10 * iScreenScale + "px", s.style.backgroundColor = "blue", s.style.color = "yellow", s.style.opacity = .7, s.style.textAlign = "center", s.style.fontSize = Math.round(1.5 * iScreenScale + 4) + "pt", s.style.fontFamily = "Courier", s.style.fontWeight = "bold", s.style.fontFamily = "arial", s.innerHTML = h, document.body.appendChild(s)
        }
        document.getElementById("octn").onclick = continuer, setTimeout(function() {
            document.getElementById("infos0").style.visibility = "visible", s && (s.style.visibility = "visible");
            var e = document.body.scrollTop;
            document.getElementById("octn").focus(), document.body.scrollTop = e
        }, 500)
    }

    function continuer() {
        document.getElementById("infos0").style.border = 0, document.getElementById("infos0").style.top = 10 * iScreenScale + 10 + "px", document.getElementById("infos0").style.left = Math.round(20 * iScreenScale + 10 + (strPlayer.length - 1) / 2 * (iWidth * iScreenScale + 2)) + "px", document.getElementById("infos0").style.background = "transparent", document.getElementById("infos0").style.fontSize = 4 * iScreenScale + "pt", document.getElementById("infos0").innerHTML = '<tr><td id="continuer"></td></tr><tr><td' + ("CM" != course ? ' style="font-size: ' + 3 * iScreenScale + 'px;">&nbsp;</td></tr>' : ' id="enregistrer"></td></tr><tr><td id="revoir"></td></tr><tr><td id="classement">') + '</td></tr><tr><td><input type="button" id="quitter" value="' + toLanguage("QUIT", "QUITTER") + '" style="font-size: ' + 3 * iScreenScale + 'pt; width: 100%;" /></td></tr>';
        var oTeamTable = document.getElementById("team-table");
        oTeamTable && document.body.removeChild(oTeamTable);
        var oContinue = document.createElement("input");
        if (oContinue.type = "button", oContinue.style.fontSize = 3 * iScreenScale + "pt", oContinue.style.width = "100%", "CM" != course)
            if (oMap.ref % 4 || "GP" != course) {
                function nextRace() {
                    pause = !0, removeGameMusics();
                    for (var e = 0; e < strPlayer.length; e++) {
                        oContainers[e].innerHTML = "", document.getElementById("infoPlace" + e).style.display = "none", document.getElementById("compteur" + e).innerHTML = "", document.getElementById("temps" + e).innerHTML = "", document.getElementById("objet" + e).style.visibility = "hidden";
                        var t = document.getElementById("lakitu" + e);
                        t && (t.style.display = "none"), fInfos = {
                            player: strPlayer,
                            map: oMap.ref + 1,
                            difficulty: iDificulty
                        }, document.getElementById("infos" + e).style.visibility = "hidden", document.getElementById("infos" + e).style.opacity = .8, document.getElementById("infos" + e).style.color = "#FF9900", document.getElementById("infos" + e).style.fontFamily = ""
                    }(document.getElementById("mariokartcontainer").style.opacity = 1) == strPlayer.length && removePlan(), oBgLayers.length = 0, document.onmousedown = void 0, setTimeout(MarioKart, 500)
                }
                isSingle && !isOnline ? oContinue.value = "        " + toLanguage("  REPLAY", "REJOUER") + "        " : "GP" == course && oMap == oMaps[3] ? oContinue.value = toLanguage("           NEXT           ", "         SUIVANT          ") : "BB" == course ? oContinue.value = toLanguage("      NEXT BATTLE\t   ", "BATAILLE SUIVANTE") : oContinue.value = toLanguage("       NEXT RACE\t   ", "COURSE SUIVANTE");
                var forceClic3 = !0;
                oContinue.onclick = function() {
                    forceClic3 = !1, nextRace()
                }, isOnline && setTimeout(function() {
                    forceClic3 && nextRace()
                }, 5e3)
            } else oContinue.value = toLanguage("           NEXT           ", "         SUIVANT          "), oContinue.onclick = function() {
                pause = !0;
                var posX = [29, 22, 36],
                    posY = [15, 17, 19],
                    oPlace;
                document.body.innerHTML = toLanguage("You are", "Vous &ecirc;tes") + ' <span id="position"></span> !<br /><a href="javascript:location.reload()" style="color: white;">' + toLanguage("Back", "Retour") + '</a><img alt="." src="images/podium.gif" style="position: absolute; left: ' + 20 * iScreenScale + "px; top: " + 20 * iScreenScale + "px; width: " + 24 * iScreenScale + 'px;" />';
                for (var placement = new Array, i = 1; i <= aKarts.length; i++)
                    for (var j = 0; j < aKarts.length; j++) aKarts[j].place == i && (placement.push(aKarts[j].personnage), j = aKarts.length);
                document.body.style.fontSize = 2 * iScreenScale + "pt";
                for (var i = 0; i < placement.length; i++) placement[i] == strPlayer && (oPlace = i + 1), i < 3 ? document.body.innerHTML += '<img alt="." src="' + getWinnerSrc(placement[i]) + '" style="width: ' + 4 * iScreenScale + "px; position: absolute; left: " + iScreenScale * posX[i] + "px; top: " + iScreenScale * (posY[i] + (isCustomPerso(placement[i]) ? 6 : 0)) + "px;" + (isCustomPerso(placement[i]) ? "transform:translateY(-100%);-webkit-transform:translateY(-100%);-moz-transform:translateY(-100%);-o-transform:translateY(-100%);-ms-transform:translateY(-100%);" : "") + '" />' : oPlace && (i = placement.length);
                if (document.getElementById("position").innerHTML = toPlace(oPlace), oPlace <= 3) {
                    document.body.innerHTML += '<img alt="." src="images/cups/cup' + oPlace + '.png" style="width: ' + 3 * iScreenScale + "px; position: absolute; left: " + 30 * iScreenScale + "px; top: " + 25 * iScreenScale + 'px;" />';
                    var saveUrl, saveParams = "pts=" + (4 - oPlace);
                    "MK" == page ? (saveUrl = "saveGP.php", saveParams += "&change=" + (oMap.map - 4) / 4) : nid && (saveUrl = "cupsave.php", saveParams += isMCups ? "&cup=" + cupIDs[oMap.ref / 4 - 1] : "&cup=" + nid), saveUrl && xhr(saveUrl, saveParams, function(reponse) {
                        if (reponse) {
                            var newPerso;
                            try {
                                newPerso = eval(reponse)
                            } catch (e) {
                                return !1
                            }
                            if (newPerso) {
                                var uwPerso = toPerso(newPerso);
                                uwPerso = uwPerso.charAt(0).toUpperCase() + uwPerso.substring(1), document.body.innerHTML += '<div style="position: absolute; left: ' + 16 * iScreenScale + "px; top: " + 30 * iScreenScale + 'px; text-align: center">' + toLanguage("You can now play<br />with " + uwPerso + " !", "Vous pouvez d&eacute;sormais<br />jouer avec " + uwPerso + " !") + '<br /><img src="' + getWinnerSrc(newPerso) + '" style="width: ' + 4 * iScreenScale + 'px" /></div>'
                            }
                            return !0
                        }
                        return !1
                    }), bMusic && (endGPMusic = startMusic("musics/menu/congrats.mp3", !0, 700))
                } else bMusic && (endGPMusic = startMusic("musics/menu/toobad.mp3", !0, 700));
                reinitChallengeVars(), clLocalVars.endGP = !0, challengeCheck("end_gp", ["finish_gp"])
            };
        else {
            var oSave = oContinue.cloneNode(!1),
                oReplay = oContinue.cloneNode(!1),
                oClassement = oContinue.cloneNode(!1);
            oContinue.value = gSelectedPerso ? toLanguage("        FACE WITH        ", "     AFFRONTER     ") : toLanguage("          RETRY          ", "     RÉESSAYER     "), oContinue.onclick = function() {
                pause = !0, removeGameMusics(), oContainers[0].innerHTML = "", document.getElementById("infoPlace0").style.display = "none", document.getElementById("compteur0").innerHTML = "", document.getElementById("temps0").innerHTML = "", document.getElementById("objet0").style.visibility = "hidden", fInfos = {
                    player: strPlayer,
                    map: oMap.ref,
                    difficulty: iDificulty,
                    perso: gPersos,
                    cpu_route: jTrajets,
                    record: gRecord
                }, gSelectedPerso && (fInfos.player = [gSelectedPerso], fInfos.perso = [strPlayer[0]], fInfos.cpu_route = [iTrajet]), document.getElementById("infos0").style.visibility = "hidden", document.getElementById("infos0").style.opacity = .8, document.getElementById("infos0").style.color = "#FF9900", document.getElementById("infos0").style.fontFamily = "", 1 == strPlayer.length && removePlan(), oBgLayers.length = 0, document.onmousedown = void 0, setTimeout(MarioKart, 500)
            }, oSave.value = "   " + toLanguage("SAVE", "ENREGISTRER") + "   ", oSave.onclick = function() {
                document.getElementById("infos0").style.visibility = "hidden";
                var oForm = document.createElement("form");
                oForm.style.color = "black", oForm.style.position = "absolute", oForm.style.left = 5 * iScreenScale + 10 + "px", oForm.style.top = 5 * iScreenScale + 10 + "px", oForm.style.fontSize = 4 * iScreenScale + "pt", oForm.style.backgroundColor = "#FF6", oForm.style.opacity = .8, oForm.style.border = "double 4px black", oForm.style.textAlign = "center", oForm.style.width = 70 * iScreenScale - 10 + "px", oForm.style.height = 25 * iScreenScale - 10 + "px", oForm.style.zIndex = 2e4, oForm.onsubmit = function() {
                    var nom = this.pseudo.value;
                    if (nom) {
                        document.body.style.cursor = "progress", this[1].style.visibility = "hidden";
                        var params = "nom=" + nom + "&perso=" + strPlayer[0] + "&temps=" + iTrajet.length;
                        switch (page) {
                            case "MK":
                                params += "&circuit=" + oMap.map;
                                break;
                            case "CI":
                                params += "&creation=" + oMap.id;
                                break;
                            case "MA":
                                params += "&map=" + oMap.map
                        }
                        xhr("records_.php", params, function(reponse) {
                            if (reponse) {
                                var enregistre;
                                document.body.style.cursor = "default";
                                try {
                                    enregistre = eval(reponse)
                                } catch (e) {
                                    return !1
                                }
                                return oInput.disabled = !0, aPara2.removeChild(oValide), aPara2.style.fontSize = Math.round(2.5 * iScreenScale) + "px", aPara2.innerHTML = enregistre ? toLanguage("Congratulations " + nom + ", your score has been saved successfully ! You places ", "F&eacute;licitations " + nom + ", votre score a bien &eacute;t&eacute; enregistr&eacute; ! Vous &ecirc;tes ") + toPlace(enregistre[0]) + toLanguage(" out of " + enregistre[1] + " in this race !", " sur " + enregistre[1] + " au classement de ce circuit !") : toLanguage("You did a better score on this race before.<br />Your score has not been registered.", "Vous avez fait un meilleur score sur ce circuit.<br />Votre temps n'a donc pas &eacute;t&eacute; enregistr&eacute;."), enregistre && (oSave.style.display = "none"), !0
                            }
                            return !1
                        }), recorder = nom
                    }
                    return !1
                };
                var aPara1 = document.createElement("p");
                aPara1.innerHTML = toLanguage("Nick : ", "Pseudo : "), aPara1.style.margin = iScreenScale + "px";
                var oInput = document.createElement("input");
                oInput.type = "text", oInput.name = "pseudo", oInput.value = recorder, oInput.size = 15, oInput.maxlength = 18, oInput.style.fontSize = 3 * iScreenScale + "px", aPara1.appendChild(oInput);
                var aPara2 = aPara1.cloneNode(!1),
                    oValide = document.createElement("input");
                oValide.type = "submit", oValide.value = "     " + toLanguage("Submit", "Valider") + "     ", oValide.style.fontSize = 5 * iScreenScale + "px", oValide.onmouseover = function() {
                    this.style.fontSize = 5 * iScreenScale + "px", oRetour.style.fontSize = 4 * iScreenScale + "px"
                }, aPara2.appendChild(oValide);
                var aPara3 = aPara1.cloneNode(!1),
                    oRetour = document.createElement("input");
                oRetour.type = "button", oRetour.value = "     " + toLanguage("Back", "Retour") + "     ", oRetour.style.fontSize = 4 * iScreenScale + "px", oRetour.onmouseover = function() {
                    this.style.fontSize = 5 * iScreenScale + "px", oValide.style.fontSize = 4 * iScreenScale + "px"
                }, oRetour.onclick = function() {
                    document.body.removeChild(oForm), document.getElementById("infos0").style.visibility = "visible"
                }, aPara3.appendChild(oRetour), oForm.appendChild(aPara1), oForm.appendChild(aPara2), oForm.appendChild(aPara3), document.body.appendChild(oForm)
            }, gSelectedPerso && (oSave.style.display = "none"), document.getElementById("enregistrer").appendChild(oSave), oReplay.value = toLanguage("REPLAY", "REVOIR"), oReplay.onclick = function() {
                pause = !0, removeGameMusics();
                for (var e = 0; e < strPlayer.length; e++) oContainers[e].innerHTML = "", document.getElementById("infoPlace" + e).style.display = "none", document.getElementById("compteur" + e).innerHTML = "", document.getElementById("temps" + e).innerHTML = "", document.getElementById("objet" + e).style.visibility = "hidden", fInfos = {
                    player: strPlayer,
                    map: oMap.ref,
                    my_route: iTrajet,
                    replay: !0,
                    perso: gPersos,
                    selPerso: gSelectedPerso,
                    cpu_route: jTrajets,
                    record: gRecord
                }, document.getElementById("infos" + e).style.visibility = "hidden", document.getElementById("infos" + e).style.opacity = .8, document.getElementById("infos" + e).style.color = "#FF9900", document.getElementById("infos" + e).style.fontFamily = "";
                1 == strPlayer.length && removePlan(), oBgLayers.length = 0, document.onmousedown = void 0, setTimeout(MarioKart, 500)
            }, document.getElementById("revoir").appendChild(oReplay), oClassement.value = "RECORDS", oClassement.onclick = function() {
                open(rankingsLink(oMap))
            }, gSelectedPerso && (oClassement.style.display = "none"), document.getElementById("classement").appendChild(oClassement)
        }
        document.getElementById("continuer").appendChild(oContinue), document.getElementById("quitter").onclick = quitter, isChatting() || oContinue.focus()
    }

    function rankingColor(e) {
        switch (e) {
            case 0:
                return "#69F";
            case 1:
                return "#F96";
            default:
                return "#990"
        }
    }
    var iViewCanvasHeight = 240,
        iViewCanvasWidth = 600,
        iViewYOffset = 10,
        oViewCanvas;

    function Sprite(e) {
        for (var r = new Array, t = 0; t < strPlayer.length; t++) {
            this[t] = {};
            var a = new Image;
            a.style.position = "absolute", a.style.left = "200px", a.alt = ".", a.className = "pixelated", a.src = getSpriteSrc(e);
            var n = document.createElement("div");
            n.style.width = "32px", n.style.height = "32px", n.style.position = "absolute", n.style.overflow = "hidden", n.style.zIndex = 1e4, n.className = "pixelated", n.style.display = "none", n.appendChild(a), oContainers[t].appendChild(n), this[t].i = t, this[t].draw = function(e, t, a, n) {
                n = n || 0;
                var o = this.i;
                if (t > iHeight * iScreenScale || t + n * iScreenScale < 9 * iScreenScale) r[o][0].style.display = "none";
                else {
                    r[o][0].style.display = "block";
                    var i = Math.round(32 * fSpriteScale * a);
                    r[o][0].style.left = Math.round(e - i / 2) + "px", r[o][0].style.top = Math.round(t - i / 2) + "px", r[o][1].style.height = i + "px", r[o][0].style.width = i + "px", r[o][0].style.height = i + "px", r[o][1].style.left = -i * r[o][2] + "px"
                }
            }, this[t].setState = function(e) {
                r[this.i][2] = e
            }, this[t].getState = function() {
                return r[this.i][2]
            }, this[t].div = n, this[t].img = a, r.push([n, a, 0])
        }
        this[0].suppr = function() {
            for (var e = 0; e < strPlayer.length; e++) oContainers[e].removeChild(r[e][0])
        }
    }

    function BGLayer(e, n) {
        var o = new Array,
            i = new Image;
        i.src = "images/map_bg/fond_" + e + ".png", iSmooth || (i.className = "pixelated");
        for (var t = 0; t < oContainers.length; t++) o[t] = document.createElement("div"), o[t].style.height = 10 * iScreenScale + "px", o[t].style.width = iWidth * iScreenScale + "px", o[t].style.position = "absolute",
            function(e) {
                setTimeout(function() {
                    e.style.backgroundImage = "url('" + i.src + "')"
                }, 500)
            }(o[t]), o[t].style.backgroundSize = "auto 100%", iSmooth || (o[t].className = "pixelated"), oContainers[t].appendChild(o[t]);
        return {
            draw: function(e, t) {
                if (i.naturalWidth) {
                    var a = (e - 360 * Math.ceil(e / 360)) * (10 * iScreenScale * i.naturalWidth / i.naturalHeight * n / 360);
                    o[t].style.backgroundPosition = Math.round(a) + "px 0"
                }
            },
            suppr: function() {
                for (var e = 0; e < strPlayer.length; e++) oContainers[e].removeChild(o[e])
            }
        }
    }

    function createMarker(e) {
        for (var t = {
                div: new Array
            }, a = 0; a < strPlayer.length; a++) {
            var n = document.createElement("div");
            n.style.display = "none", n.style.position = "absolute", n.style.opacity = .7;
            var o = -1 == e.team ? "#EEE" : 1 == e.team ? "red" : "blue",
                i = 12 * iScreenScale,
                r = 3 * iScreenScale,
                l = Math.PI / 4,
                s = Math.round(iScreenScale / 4),
                c = Math.cos(l),
                u = Math.sin(l),
                p = document.createElement("div");
            p.style.position = "absolute", p.style.width = s + "px", p.style.height = r + "px", p.style.backgroundColor = o, p.style.left = "0px", p.style.bottom = "0px", p.style.transform = p.style.WebkitTransform = p.style.MozTransform = "rotate(" + Math.round(180 * l / Math.PI) + "deg)", p.style.transformOrigin = p.style.WebkitTransformOrigin = p.style.MozTransformOrigin = "bottom left", n.appendChild(p);
            var d = document.createElement("div");
            d.style.position = "absolute", d.style.width = i + "px", d.style.height = s + "px", d.style.backgroundColor = o, d.style.left = Math.round(r * Math.sin(l)) + "px", d.style.bottom = Math.round(r * c - s * u) + "px", n.appendChild(d);
            var m = document.createElement("div");
            m.style.color = -1 == e.team ? "#555" : o, m.style.whiteSpace = "nowrap";
            var y = -1 == e.team ? "#EEE" : 1 == e.team ? "#fcc" : "#ccf",
                h = Math.ceil(iScreenScale / 4) + "px";
            m.style.textShadow = "-" + h + " 0 " + y + ", 0 " + h + " " + y + ", " + h + " 0 " + y + ", 0 -" + h + " " + y, e.nick ? m.innerHTML = e.nick : (m.style.textTransform = "capitalize", m.innerHTML = toPerso(e.personnage)), m.style.position = "absolute", m.style.left = Math.round(r * u) + "px", m.style.bottom = Math.round(r * c) + "px", m.style.width = Math.round(i - .5 * iScreenScale) + "px", m.style.overflow = "hidden", m.style.fontSize = Math.round(1.5 * iScreenScale) + "px", m.style.textAlign = "right", n.appendChild(m), t.div.push(n), oContainers[a].appendChild(n)
        }
        return t.draw = function(e, t, a, n, o) {
            o = o || 0;
            var i = this.div[e];
            if (a > iHeight * iScreenScale || a + o * iScreenScale < 12 * iScreenScale) i.style.display = "none";
            else {
                i.style.display = "block";
                var r = Math.round(32 * fSpriteScale * n);
                i.style.left = Math.round(t) + "px", i.style.top = Math.round(a - r / 2) + "px"
            }
        }, t
    }

    function render() {
        collisionTest = COL_OBJ, collisionTeam = void 0, clLocalVars.currentKart = void 0;
        for (var e = 0; e < strPlayer.length; e++)
            if (oPlayers[e].tombe <= 10) {
                var t = oPlayers[e].x,
                    a = oPlayers[e].y,
                    n = oPlayers[e].rotation;
                oPlayers[e].tours == oMap.tours + 1 && oPlayers[e].changeView < 180 && (oPlayers[e].changeView += 15), oPlayers[e].changeView && (n += n < 360 - oPlayers[e].changeView ? oPlayers[e].changeView : oPlayers[e].changeView - 360), oViewCanvas.getContext("2d").fillStyle = "rgb(" + oMap.bgcolor + ")", oViewCanvas.getContext("2d").fillRect(0, 0, oViewCanvas.width, oViewCanvas.height), oViewCanvas.getContext("2d").save(), oViewCanvas.getContext("2d").translate(iViewCanvasWidth / 2, iViewCanvasHeight - iViewYOffset), oViewCanvas.getContext("2d").rotate((180 + n) * Math.PI / 180), oViewCanvas.getContext("2d").drawImage(oMapImg, -t, -a), oViewCanvas.getContext("2d").restore(), oScreens[e].getContext("2d").imageSmoothingEnabled = iSmooth;
                for (var o = 0; o < aStrips.length; o++) {
                    var i = aStrips[o];
                    try {
                        oScreens[e].getContext("2d").drawImage(oViewCanvas, iViewCanvasWidth / 2 - i.stripwidth / 2, iViewCanvasHeight - iViewYOffset - i.mapz - 1, i.stripwidth, i.mapzspan, 0, (iHeight - i.viewy) / fLineScale, iWidth / fLineScale, 1)
                    } catch (e) {}
                }
                var r, l = iWidth / 2 * iScreenScale,
                    s = (iHeight - iViewYOffset - correctZ(oPlayers[e].z)) * iScreenScale;
                for (o = 0; o < aKarts.length; o++)
                    if ((r = aKarts[o]).cpu || r != oPlayers[e]) {
                        for (var c = r.x - t, u = r.y - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight + correctZ(r.z), h = -d / (m + iCamDist) * iCamDist, g = n - r.rotation; g < 0;) g += 360;
                        for (; 360 < g;) g -= 360;
                        var f = Math.round(11 * g / 180) + r.tourne % 21;
                        21 < f && (f -= 22), r.figstate && (f = (f + 21 - r.figstate) % 21), r.sprite[e].setState(f), r.sprite[e].div.style.zIndex = Math.round(1e4 - m);
                        var S = (iWidth / 2 + h) * iScreenScale,
                            b = (iHeight - y) * iScreenScale,
                            v = fFocal / (fFocal + m) * r.size,
                            C = correctZ(r.z);
                        if (r.sprite[e].draw(S, b, v, C), "BB" == course) {
                            var M = r.ballons.length,
                                x = fFocal / (fFocal + m) * r.size;
                            for (I = 1; I <= M; I++) r.ballons[I - 1][e].draw((iWidth / 2 + h + 2.5 * (I - M / 2) * x) * iScreenScale, (iHeight - y - 6 * x) * iScreenScale, x / 2, 6 * x)
                        }!r.marker || r.loose || r.tombe || (r.marker.draw(e, S, b, v, C), r.marker.div[e].style.zIndex = Math.round(10001 - m))
                    } for (o = 0; o < oMap.arme.length; o++)
                    if (r = oMap.arme[o], isNaN(r[2])) {
                        c = r[0] - t, u = r[1] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                        r[2][e].div.style.zIndex = Math.round(1e4 - m), r[2][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y) * iScreenScale, fFocal / (fFocal + m))
                    } else e || (r[2] ? r[2]-- : r[2] = new Sprite("objet"));
                if (oMap.decor)
                    for (o = 1; o < oMap.decor.length; o++) {
                        c = (r = oMap.decor[o])[0] - t, u = r[1] - a;
                        var P = correctZ(r[3] ? r[3] : 0);
                        p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight + P;
                        P && 180 < P * m && 0 < y && y < iHeight && (y = iHeight - 9);
                        h = -d / (m + iCamDist) * iCamDist;
                        r[2][e].div.style.zIndex = Math.round(1e4 - m), r[2][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y) * iScreenScale, fFocal / (fFocal + m) * 1.2)
                    }
                for (o = 0; o < bananes.length; o++) {
                    c = (r = bananes[o])[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                    r[0][e].div.style.zIndex = Math.round(1e4 - m), r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - correctZ(r[5])) * iScreenScale, fFocal / (fFocal + m) / 1.5)
                }
                for (o = 0; o < fauxobjets.length; o++) {
                    c = (r = fauxobjets[o])[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                    r[0][e].div.style.zIndex = Math.round(1e4 - m), r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - correctZ(r[5])) * iScreenScale, fFocal / (fFocal + m))
                }
                for (o = 0; o < carapaces.length; o++) {
                    var k = 8 * direction(0, (r = carapaces[o])[6]),
                        E = 8 * direction(1, r[6]);
                    if (e || -1 == r[6]) X = r[3], Z = r[4];
                    else {
                        X = r[3] + k, Z = r[4] + E;
                        for (var I = 0; I < oPlayers.length; I++) r[0][I].setState(1 - r[0][I].getState())
                    }
                    c = r[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                    if (r[0][e].div.style.zIndex = Math.round(1e4 - m), r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - correctZ(r[5])) * iScreenScale, fFocal / (fFocal + m) / 1.5), !e) {
                        var T = Math.round(r[3]),
                            w = Math.round(r[4]),
                            B = Math.round(X),
                            L = Math.round(Z);
                        if (-1 != r[6] && tombe(T, w) || touche_banane(T, w) || touche_banane(B, L) || touche_crouge(T, w) || touche_crouge(B, L) || touche_cverte(T, w, o) || touche_cverte(B, L, o)) detruit(carapaces, o, !0), o--;
                        else if (-1 == r[6] || canMoveTo(r[3], r[4], k, E)) r[3] = X, r[4] = Z;
                        else if (r[7]--, 0 < r[7]) {
                            var z = getHorizontality(r[3], r[4], k, E),
                                j = 180 * Math.atan2(-z[1], z[0]) / Math.PI,
                                D = normalizeAngle(r[6] - j, 180);
                            r[6] = normalizeAngle(r[6] - 2 * D + 180, 360)
                        } else detruit(carapaces, o), o--
                    }
                }
                for (o = 0; o < carapacesRouge.length; o++)
                    if ((r = carapacesRouge[o])[0][e].div.style.opacity) {
                        if (!e) {
                            var H = r[0][0].div.style.opacity - .2;
                            for (I = 0; I < strPlayer.length; I++) r[0][I].div.style.opacity = H;
                            H < .01 && (detruit(carapacesRouge, o), o--)
                        }
                    } else
                        for (var O = 0; O < 2; O++) {
                            if (e || -1 == r[6]) X = r[3], Z = r[4];
                            else {
                                if (!O)
                                    for (var I = 0; I < oPlayers.length; I++) r[0][I].setState(1 - r[0][I].getState());
                                var R, A = oMap.aipoints[0];
                                if (-1 != r[8]) {
                                    k = A[r[8]][0] - r[3], E = A[r[8]][1] - r[4];
                                    var K = A[r[8]];
                                    r[3] > K[0] - 10 && r[3] < K[0] + 10 && r[4] > K[1] - 10 && r[4] < K[1] + 10 && (r[8] < A.length - 1 ? r[8]++ : r[8] = 0), k /= U = Math.sqrt(k * k + E * E) / 5, E /= U
                                } else {
                                    if ("BB" != course)
                                        for (I = 0; I < A.length; I++) {
                                            K = A[I];
                                            r[3] > K[0] - 35 && r[3] < K[0] + 35 && r[4] > K[1] - 35 && r[4] < K[1] + 35 && (r[8] = I + 1, r[8] == A.length && (r[8] = 0), I = A.length)
                                        }
                                    k = 5 * direction(0, r[6]), E = 5 * direction(1, r[6])
                                }
                                X = r[3] + k, Z = r[4] + E;
                                var V = 1e3;
                                for (I = 0; I < aKarts.length; I++) {
                                    var N = aKarts[I];
                                    if (N.id != r[7] && !sameTeam(r[2], N.team) && !N.tombe && !N.loose) {
                                        var F = Math.pow(N.x - X, 2) + Math.pow(N.y - Z, 2);
                                        F < V && (X = N.x, Z = N.y, V = F, R = N)
                                    }
                                    if (R && R.using[0] && R.using[0] != fauxobjets) {
                                        for (var W = Math.atan2(r[4] - Z, r[3] - X) - (90 - R.rotation) * Math.PI / 180, _ = 2 * Math.PI; W < 0;) W += _;
                                        for (; _ < W;) W -= _;
                                        W > Math.PI && (W = _ - W), 2 < Math.abs(W) ? (isOnline ? (detruit(carapacesRouge, o), o--) : r[0][e].div.style.opacity = .8, X -= 5 * direction(0, R.rotation), Z -= 5 * direction(1, R.rotation), detruit(R.using[0], R.using[1], !0), O = 1) : (R.using[0][R.using[1]][3] -= 2 * direction(0, R.rotation), R.using[0][R.using[1]][4] -= 2 * direction(1, R.rotation))
                                    }
                                }
                                X = Math.round(X), Z = Math.round(Z)
                            }
                            if (!e && (-1 != r[7] && (tombe(X, Z) || !canMoveTo(r[3], r[4], k, E)) || touche_banane(X, Z) || touche_banane(r[3], r[4]) || touche_crouge(X, Z, o) || touche_crouge(r[3], r[4], o) || touche_cverte(X, Z) || touche_cverte(r[3], r[4]))) e || (isOnline ? (detruit(carapacesRouge, o), o--) : r[0][e].div.style.opacity = .8, O = 1);
                            else if (r[3] = X, r[4] = Z, O) {
                                c = r[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                                r[0][e].div.style.zIndex = Math.round(1e4 - m), r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - correctZ(r[5])) * iScreenScale, fFocal / (fFocal + m) / 1.5)
                            }
                        }
                for (o = 0; o < carapacesBleue.length; o++) {
                    c = (r = carapacesBleue[o])[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist;
                    var G = -1;
                    for (I = 0; I < aKarts.length; I++)
                        if (aKarts[I].id == r[5]) {
                            G = I;
                            break
                        } if (-1 == G) {
                        G = aKarts.length - 1;
                        var q = 1;
                        for (I = 0; I < aKarts.length; I++) aKarts[I].place == q && (I = (aKarts[I].tours <= oMap.tours || "BB" == course) && !sameTeam(r[2], aKarts[I].team) ? (r[5] = aKarts[I].id, G = I, aKarts.length) : (q++, -1))
                    }
                    k = r[3] - aKarts[G].x, E = r[4] - aKarts[G].y;
                    var J = 1;
                    if (0 < r[6]) {
                        if (!e) {
                            if (100 < Math.abs(k * E)) {
                                var U;
                                k /= U = Math.sqrt(Math.pow(k, 2) + Math.pow(E, 2)) / 10, E /= U;
                                for (I = 0; I < oPlayers.length; I++) r[0][I].setState(1 - r[0][I].getState())
                            } else if (r[0][e].setState(Math.round(Math.random())), r[6]--, r[6]) h += r[6] - 2.5, y -= Math.abs(5 - r[6]);
                            else {
                                for (I = 0; I < strPlayer.length; I++) makeSpriteExplode(r, "explosionB", I), "block" == r[0][I].div.style.display && ($ = I);
                                isOnline || null == $ ? playDistSound(aKarts[G], "musics/events/boom.mp3", 200) : (r[0][$].img.onload = function() {
                                    bCounting = !1, r[0][$].img.onload = void 0, reprendre(!1), playDistSound(aKarts[G], "musics/events/boom.mp3", 200)
                                }, pause = bCounting = !0), k *= aKarts[G].speed / 2, E *= aKarts[G].speed / 2;
                                for (I = 0; I < oPlayers.length; I++) r[0][I].setState(0);
                                r[0][e].div.style.opacity = 1
                            }
                            r[3] -= k, r[4] -= E
                        }
                    } else if (bCounting || (J = 10), !e) {
                        isOnline && r[5] == oPlayers[0].id && r[6] < -10 && (r[6] = 0), r[6]--;
                        for (I = 0; I < oPlayers.length; I++) r[0][I].div.style.opacity = Math.max(1 + r[6] / 10, 0);
                        var Y = isOnline && r[5] != oPlayers[0].id ? -70 : -10;
                        r[6] < Y && (detruit(carapacesBleue, o), J = !1, o--)
                    }
                    J && (r[0][e].div.style.zIndex = Math.round(1e4 - m), r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - (0 < r[6] ? 15 + aKarts[G].speed : 0)) * iScreenScale, fFocal / (fFocal + m) * J))
                }
                for (o = 0; o < bobombs.length; o++) {
                    c = (r = bobombs[o])[3] - t, u = r[4] - a, p = n * Math.PI / 180, d = c * Math.cos(p) - u * Math.sin(p), m = c * Math.sin(p) + u * Math.cos(p), y = -iCamHeight / (iCamDist + m) * iCamDist + iCamHeight - iViewHeight, h = -d / (m + iCamDist) * iCamDist, J = 1;
                    var Q = 0;
                    if (-1 != r[6])
                        if (r[7]) {
                            if (!e) {
                                r[7]--;
                                k = 15 * direction(0, r[6]), E = 15 * direction(1, r[6]);
                                var X = r[3] + k,
                                    Z = r[4] + E;
                                r[3] = X, r[4] = Z
                            }
                            Q = r[7]
                        } else {
                            if (tombe(Math.round(r[3]), Math.round(r[4])) && (detruit(bobombs, o), J = !1, o--), e || 30 == --r[8] && (r[8] -= 12), !r[8] && !e) {
                                var $;
                                for (I = 0; I < strPlayer.length; I++) makeSpriteExplode(r, "explosion", I), "block" == r[0][I].div.style.display && ($ = I);
                                isOnline || null == $ ? playDistSound({
                                    x: r[3],
                                    y: r[4]
                                }, "musics/events/boom.mp3", 200) : (r[0][$].img.onload = function() {
                                    bCounting = !1, r[0][$].img.onload = void 0, reprendre(!1), playDistSound({
                                        x: r[3],
                                        y: r[4]
                                    }, "musics/events/boom.mp3", 200)
                                }, pause = bCounting = !0), r[0][e].div.style.opacity = 1
                            }
                            if (r[8] <= 0 && (bCounting || (J = 10), !e)) {
                                for (I = 0; I < oPlayers.length; I++) r[0][I].div.style.opacity = 1 + r[8] / 10;
                                r[8] < -10 && (detruit(bobombs, o), J = !1, o--)
                            }
                        } if (J) {
                        r[0][e].div.style.zIndex = Math.round(1e4 - m);
                        var ee = correctZ(r[5] + 2 * (8 - Math.abs(Q - 8)));
                        r[0][e].draw((iWidth / 2 + h) * iScreenScale, (iHeight - y - ee) * iScreenScale, fFocal / (fFocal + m) * J, ee)
                    }
                }
                if (oPlayers[e].sprite[e].div.style.zIndex = 1e4, oPlayers[e].sprite[e].draw(l, s, oPlayers[e].size, correctZ(oPlayers[e].z)), "BB" == course) {
                    M = oPlayers[e].ballons.length;
                    for (o = 0; o < M; o++) oPlayers[e].ballons[o][e].draw(l + (2 * oPlayers[e].size + 2.5 * (o - M / 2) * oPlayers[e].size) * iScreenScale, s - (2 + 4 * oPlayers[e].size) * iScreenScale, oPlayers[e].size / 2, 6 * oPlayers[e].size)
                }
                for (o = 0; o < aKarts.length; o++) {
                    var te = aKarts[o],
                        ae = te.sprite[e];
                    0 < te.figstate && te.figuring ? ae.div.hallowed || (ae.div.hallowed = !0, ae.div.style.backgroundImage = "url('images/halo.png')", ae.div.style.backgroundRepeat = "no-repeat", ae.div.style.backgroundSize = "contain", ae.img.style.opacity = .7) : ae.div.hallowed && (ae.div.hallowed = !1, ae.div.style.backgroundImage = "", ae.div.style.backgroundRepeat = "", ae.div.style.backgroundSize = "", ae.img.style.opacity = 1)
                }
                for (o = 0; o < oBgLayers.length; o++) oBgLayers[o].draw(n, e);
                1 == strPlayer.length && setPlanPos()
            }
    }

    function makeSpriteExplode(e, t, a) {
        switch (e[2]) {
            case 0:
                t = "explosionB";
                break;
            case 1:
                t = "explosionR"
        }
        e[0][a].img.src = "images/sprites/sprite_" + t + ".png";
        var n = e[0][a].div.getElementsByClassName("sprite-hallow");
        n.length && e[0][a].div.removeChild(n[0])
    }

    function correctZ(e) {
        return 2 * Math.pow(e / 2, .7)
    }

    function direction(e, t) {
        return Math[["sin", "cos"][e]](t * Math.PI / 180)
    }

    function randObj(e) {
        return objets[Math.floor(120 * Math.random() / aKarts.length + 120 * (e.place - 1) / aKarts.length)]
    }

    function possibleObjs(e, t) {
        for (var a = Math.floor(120 * (e.place - 1) / aKarts.length), n = Math.floor(120 * e.place / aKarts.length), o = {}, i = a; i < n; i++) t[objets[i]] || (o[objets[i]] = !0);
        return o
    }

    function otherObjects(e, t) {
        for (var a = {}, n = 0; n < t.length; n++) a[t[n]] = !0;
        var o = possibleObjs(e, a);
        return 0 < Object.getOwnPropertyNames(o).length
    }

    function friendlyFire(e, t) {
        return e == t || iTeamPlay && e.team == t.team
    }

    function sameTeam(e, t) {
        return -1 != e && e == t
    }

    function addNewBalloon(e, t) {
        e.ballons.push(createBalloonSprite(e, t))
    }

    function createBalloonSprite(e, t) {
        return void 0 === t && (t = e.team), new Sprite(1 == t ? "ballonR" : "ballon")
    }

    function balloonSrc(e) {
        return "images/sprites/sprite_" + (1 == e ? "ballonR" : "ballon") + ".png"
    }

    function detruit(e, t, a) {
        if (e[t]) {
            if (isOnline) {
                for (var n = [bananes, fauxobjets, carapaces, carapacesRouge, carapacesBleue, bobombs].indexOf(e), o = 0; o < nbNews[n].length; o++) nbNews[n][o] > t ? nbNews[n][o]-- : nbNews[n][o] == t && (nbNews[n].splice(o, 1), o--);
                destructions[n].push(e[t][1])
            }
            supprime(e, t, a)
        }
    }

    function supprime(e, t, a) {
        e[t][0][0].suppr();
        for (var n = 0; n < aKarts.length; n++) {
            var o = aKarts[n].using;
            o[0] == e && t <= o[1] && (t != o[1] ? o[1]-- : (aKarts[n].using = [!1], a && playIfShould(aKarts[n], "musics/events/hit.mp3") && (a = !1)))
        }
        if ("object" == typeof a && playDistSound(a, "musics/events/hit.mp3", 80), clLocalVars.myItems) {
            var i = clLocalVars.myItems.indexOf(e[t]); - 1 != i && clLocalVars.myItems.splice(i, 1)
        }
        e.splice(t, 1)
    }

    function supprArme(e) {
        var t = aKarts[e];
        t.arme = !1, t.roulette = 0, kartIsPlayer(t) && (document.getElementById("roulette" + e).innerHTML = "", document.getElementById("scroller" + e).style.visibility = "hidden", removeIfExists(t.rouletteSound))
    }

    function stopDrifting(e) {
        var t = aKarts[e];
        kartIsPlayer(t) && (aKarts[e].driftinc = 0, aKarts[e].driftcpt = 0, aKarts[e].turbodrift = 0, getDriftImg(e).src = "images/drift.png", document.getElementById("drift" + e).style.display = "none", t.driftSound && (t.driftSound.pause(), t.driftSound = void 0), t.sparkSound && (t.sparkSound.pause(), t.sparkSound = void 0))
    }

    function pCol(e) {
        for (var t = 0; t < strPlayer.length; t++)
            if (!friendlyFire(e, oPlayers[t]) && ("BB" != course || e.ballons.length && oPlayers[t].ballons.length) && Math.pow(e.x - oPlayers[t].x, 2) + Math.pow(e.y - oPlayers[t].y, 2) < 25 && Math.max(e.z, oPlayers[t].z) < 2 && !e.tourne && Math.abs(oPlayers[t].speed - e.speed) < 2) {
                var a = oPlayers[t].speed < e.speed ? e : oPlayers[t];
                a.speed = 2, a.colSound || (a.colSound = playIfShould(a, "musics/events/colkart.mp3"), a.colSound && (a.colSound.onended = function() {
                    a.colSound = void 0, document.body.removeChild(this)
                }))
            }
    }

    function pointInRectangle(e, t, a) {
        return e > a[0] && e < a[0] + a[2] && t > a[1] && t < a[1] + a[3]
    }

    function pointInPolygon(e, t, a) {
        for (var n = !1, o = 0, i = a.length - 1; o < a.length; i = o++) {
            var r = a[o][0],
                l = a[o][1],
                s = a[i][0],
                c = a[i][1];
            t < l != t < c && e < (s - r) * (t - l) / (c - l) + r && (n = !n)
        }
        return n
    }

    function canMoveTo(e, t, a, n, o) {
        var i = e + a,
            r = t + n;
        if (oMap.decor)
            for (var l = 1; l < oMap.decor.length; l++) {
                if (i > (m = oMap.decor[l])[0] - 5 && i < m[0] + 5 && r > m[1] - 5 && r < m[1] + 5 && (!m[3] || m[3] < 4)) {
                    if (o) {
                        oMap.decor[l][2][0].suppr(), oMap.decor.splice(l, 1);
                        break
                    }
                    return !1
                }
            }
        if (!oMap.collision) return !0;
        if (!isCup)
            if ("BB" == course || oMap.map <= 20) {
                if (e > oMap.w - 5 || t > oMap.h - 5 || e < 4 || t < 4) return !0
            } else if (e >= oMap.w || t >= oMap.h || e < 0 || t < 0) return !0;
        var s = oMap.collision.rectangle;
        for (l = 0; l < s.length; l++)
            if (pointInRectangle(e, t, s[l])) return !0;
        var c = oMap.collision.polygon;
        for (l = 0; l < c.length; l++)
            if (pointInPolygon(e, t, c[l])) return !0;
        if (!isCup)
            if ("BB" == course || oMap.map <= 20) {
                if (i > oMap.w - 5 || r > oMap.h - 5 || i < 4 || r < 4) return !1
            } else if (i >= oMap.w || r >= oMap.h || i < 0 || r < 0) return !1;
        var u = [e, t],
            p = [a, n],
            d = [0 < a, 0 < n];
        for (l = 0; l < s.length; l++)
            for (var m = s[l], y = 0; y < 2; y++) {
                var h = d[y];
                if (h ? u[y] <= m[y] && u[y] + p[y] >= m[y] : u[y] >= m[y] + m[y + 2] && u[y] + p[y] <= m[y] + m[y + 2]) {
                    var g = 1 - y,
                        f = u[g] + ((h ? m[y] : m[y] + m[y + 2]) - u[y]) * p[g] / p[y];
                    if (f >= m[g] && f <= m[g] + m[2 + g]) return !1
                }
            }
        for (l = 0; l < c.length; l++) {
            var S = c[l];
            for (y = 0; y < S.length; y++) {
                var b = S[y],
                    v = S[(y + 1) % S.length];
                if (secants(e, t, i, r, b[0], b[1], v[0], v[1])) return !1
            }
        }
        return !0
    }

    function getLineHorizontality(e, t, a, n, o) {
        for (var i = 0; i < o.length; i++) {
            var r = o[i],
                l = secants(e, t, a, n, r.x1, r.y1, r.x2, r.y2);
            if (l) return {
                dir: [r.x2 - r.x1, r.y2 - r.y1],
                t: l[0]
            }
        }
        return null
    }

    function secants(e, t, a, n, o, i, r, l) {
        var s = -a * l + a * i + e * l - e * i + r * n - r * t - o * n + o * t,
            c = (-r * t + o * t - e * i + e * l + r * i - o * l) / s;
        if (0 <= c && c <= 1) {
            var u = (e * n - a * t + a * i - e * i - o * n + o * t) / s;
            if (0 <= u && u <= 1) return [c, u]
        }
        return null
    }

    function getHorizontality(e, t, a, n) {
        var o = {
                t: 1
            },
            i = e + a,
            r = t + n;
        if (isCup || ("BB" == course || oMap.map <= 20 ? ((i > oMap.w - 5 || i < 4) && (o.dir = [0, oMap.h]), (r > oMap.h - 5 || r < 4) && (o.dir = [oMap.w, 0])) : ((i >= oMap.w || i < 0) && (o.dir = [0, oMap.h]), (r >= oMap.h || r < 0) && (o.dir = [oMap.w, 0]))), oMap.decor)
            for (var l = 1; l < oMap.decor.length; l++) {
                (g = getLineHorizontality(e, t, i, r, p = [{
                    x1: (c = oMap.decor[l])[0] - 5,
                    y1: c[1] - 5,
                    x2: c[0] + 5,
                    y2: c[1] - 5
                }, {
                    x1: c[0] - 5,
                    y1: c[1] - 5,
                    x2: c[0] - 5,
                    y2: c[1] + 5
                }, {
                    x1: c[0] - 5,
                    y1: c[1] + 5,
                    x2: c[0] + 5,
                    y2: c[1] + 5
                }, {
                    x1: c[0] + 5,
                    y1: c[1] - 5,
                    x2: c[0] + 5,
                    y2: c[1] + 5
                }])) && g.t < o.t && (o = g)
            }
        if (oMap.collision) {
            var s = oMap.collision.rectangle;
            for (l = 0; l < s.length; l++) {
                var c;
                (g = getLineHorizontality(e, t, i, r, p = [{
                    x1: (c = s[l])[0],
                    y1: c[1],
                    x2: c[0] + c[2],
                    y2: c[1]
                }, {
                    x1: c[0],
                    y1: c[1],
                    x2: c[0],
                    y2: c[1] + c[3]
                }, {
                    x1: c[0] + c[2],
                    y1: c[1],
                    x2: c[0] + c[2],
                    y2: c[1] + c[3]
                }, {
                    x1: c[0],
                    y1: c[1] + c[3],
                    x2: c[0] + c[2],
                    y2: c[1] + c[3]
                }])) && g.t < o.t && (o = g)
            }
            var u = oMap.collision.polygon;
            for (l = 0; l < u.length; l++) {
                for (var p = [], d = u[l], m = 0; m < d.length; m++) {
                    var y = d[m],
                        h = d[(m + 1) % d.length];
                    p.push({
                        x1: y[0],
                        y1: y[1],
                        x2: h[0],
                        y2: h[1]
                    })
                }
                var g;
                (g = getLineHorizontality(e, t, i, r, p)) && g.t < o.t && (o = g)
            }
        }
        if (o.dir) {
            var f = Math.hypot(o.dir[0], o.dir[1]);
            o.dir[0] /= f, o.dir[1] /= f
        } else o.dir = [.7, .7];
        return o.dir
    }

    function normalizeAngle(e, t) {
        return e - t * Math.round(e / t)
    }

    function objet(e, t) {
        for (var a = 0; a < oMap.arme.length; a++) {
            var n = oMap.arme[a];
            if (e > n[0] - 7 && e < n[0] + 7 && t > n[1] - 7 && t < n[1] + 7 && isNaN(n[2])) {
                for (a = 0; a < strPlayer.length; a++) n[2][a].div.style.display = "none";
                return n[2] = 20, !0
            }
        }
        return !1
    }

    function res_sauts(e) {
        return isCup ? (e[2] + e[3]) / 45 + 1 : oMap.sauts[0]
    }

    function sauts(e, t, a, n) {
        if (!oMap.sauts) return !1;
        for (var o = [e, t], i = [a, n], r = [0 < a, 0 < n], l = isCup ? 0 : 1; l < oMap.sauts.length; l++) {
            var s = oMap.sauts[l];
            if (pointInRectangle(e, t, s)) return res_sauts(s);
            for (var c = 0; c < 2; c++) {
                var u = r[c];
                if (u ? o[c] <= s[c] && o[c] + i[c] >= s[c] : o[c] >= s[c] + s[c + 2] && o[c] + i[c] <= s[c] + s[c + 2]) {
                    var p = 1 - c,
                        d = o[p] + ((u ? s[c] : s[c] + s[c + 2]) - o[c]) * i[p] / i[c];
                    if (d >= s[p] && d <= s[p] + s[2 + p]) return res_sauts(s)
                }
            }
        }
        return !1
    }

    function ralenti(e, t) {
        for (var a in oMap.horspistes) {
            for (var n = oMap.horspistes[a], o = n.rectangle, i = 0; i < o.length; i++)
                if (pointInRectangle(e, t, o[i])) return a;
            var r = n.polygon;
            for (i = 0; i < r.length; i++)
                if (pointInPolygon(e, t, r[i])) return a
        }
        return !1
    }

    function accelere(e, t) {
        if (!oMap.accelerateurs) return !1;
        for (var a = 0; a < oMap.accelerateurs.length; a++) {
            if (pointInRectangle(e, t, oMap.accelerateurs[a])) return !0
        }
        return !1
    }

    function tombe(e, t, a) {
        var n, o;
        if (e > oMap.w || t > oMap.h || e < 0 || t < 0) return n = null != oMap.startposition[2] ? oMap.startposition[2] : null != oMap.startrotation ? oMap.startrotation / 90 : 2, "BB" == course || [oMap.startposition[0], oMap.startposition[1], n];
        if (!oMap.trous) return !1;
        for (var i = 0; i < 4; i++) {
            for (var r = oMap.trous[i].rectangle, l = 0; l < r.length; l++) {
                if (pointInRectangle(e, t, (c = r[l])[0])) {
                    if (null == a) return !0;
                    if (o = [c[1][0], c[1][1], i], i % 2 - a) return o
                }
            }
            var s = oMap.trous[i].polygon;
            for (l = 0; l < s.length; l++) {
                var c;
                if (pointInPolygon(e, t, (c = s[l])[0])) {
                    if (null == a) return !0;
                    if (o = [c[1][0], c[1][1], i], i % 2 - a) return o
                }
            }
        }
        return o || !1
    }
    var lambdaReturnsTrue = function(e) {
            return !0
        },
        challengeRules = {
            finish_circuit: {
                verify: "end_game",
                success: lambdaReturnsTrue
            },
            finish_circuit_first: {
                verify: "end_game",
                success: function(e) {
                    return 1 == oPlayers[0].place
                }
            },
            finish_circuit_time: {
                verify: "end_game",
                success: function(e) {
                    return 67 * (timer - 1) / 1e3 <= e.value
                }
            },
            finish_arena: {
                verify: "end_game",
                success: lambdaReturnsTrue
            },
            finish_arena_first: {
                verify: "end_game",
                success: function(e) {
                    return 1 == oPlayers[0].place
                }
            },
            hit: {
                verify: "each_hit",
                initLocalVars: function(e) {
                    clLocalVars.myItems = [], clLocalVars.nbHits = 0
                },
                success: function(e) {
                    return clLocalVars.nbHits >= e.value
                }
            },
            eliminate: {
                verify: "each_kill",
                initLocalVars: function(e) {
                    clLocalVars.myItems = [], clLocalVars.killed = [], clLocalVars.nbKills = 0, clLocalVars.nbHits = 0
                },
                success: function(e) {
                    return clLocalVars.nbKills >= e.value
                }
            },
            survive: {
                verify: "each_frame",
                success: function(e) {
                    return 67 * (timer - 1) / 1e3 >= e.value
                }
            },
            reach_zone: {
                verify: "each_frame",
                success: function(e) {
                    for (var t = e.value, a = oPlayers[0].x, n = oPlayers[0].y, o = 0; o < t.length; o++) {
                        var i = t[o];
                        if (a >= i[0] && n >= i[1] && a < i[0] + i[2] && n < i[1] + i[3]) return !0
                    }
                }
            },
            gold_cup: {
                verify: "end_gp",
                initRuleVars: function() {
                    return {
                        nbcircuits: 0
                    }
                },
                success: function(e, t) {
                    if (clLocalVars.endGP && 4 == t.nbcircuits) return 1 == oPlayers[0].place
                },
                next_circuit: function(e) {
                    e.nbcircuits++
                }
            },
            gold_cups: {
                verify: "end_gp",
                initRuleVars: function(e) {
                    return {
                        challenge: e,
                        nbcircuits: 0
                    }
                },
                success: function(e, t) {
                    if (clLocalVars.endGP && 4 == t.nbcircuits) {
                        if (1 != oPlayers[0].place) return !1;
                        var a = sessionStorage.getItem("cl" + t.challenge.id + ".gold_cups");
                        if (a = a || "{}", a = JSON.parse(a), !t.challenge.data.constraints.length)
                            for (var n = 0; n < ptsGP.length; n++) 3 == ptsGP.charAt(n) && (a[cupIDs[n]] = !0);
                        var o = a[cupIDs[oMap.ref / 4 - 1]] = !0;
                        for (n = 0; n < cupIDs.length; n++) {
                            if (!a[cupIDs[n]]) {
                                o = !1;
                                break
                            }
                        }
                        if (o) return sessionStorage.removeItem("cl" + t.challenge.id + ".gold_cups"), !0
                    }
                },
                next_circuit: function(e) {
                    e.nbcircuits++
                },
                finish_gp: function(e) {
                    if (4 == e.nbcircuits) {
                        var t = sessionStorage.getItem("cl" + e.challenge.id + ".gold_cups");
                        t = t || "{}", (t = JSON.parse(t))[cupIDs[oMap.ref / 4 - 1]] = !0, sessionStorage.setItem("cl" + e.challenge.id + ".gold_cups", JSON.stringify(t));
                        var a = !e.challenge.data.constraints.length;
                        if (a)
                            for (var n = 0; n < ptsGP.length; n++) 3 == ptsGP.charAt(n) && (t[cupIDs[n]] = !0);
                        showChallengePartialSuccess(e.challenge, {
                            nb: Object.keys(t).length,
                            total: cupIDs.length,
                            warning: !a
                        })
                    }
                }
            },
            finish_circuits_first: {
                verify: "end_game",
                initRuleVars: function() {
                    return {
                        nbcircuits: 1
                    }
                },
                success: function(e, t) {
                    return 1 == oPlayers[0].place && (t.nbcircuits >= e.value || void 0)
                },
                next_circuit: function(e) {
                    e.nbcircuits++
                }
            },
            pts_greater: {
                verify: "end_game",
                initRuleVars: function() {
                    return clGlobalVars.nbcircuits ? {} : {
                        nbcircuits: 1,
                        initialscore: 0
                    }
                },
                success: function(e, t) {
                    if (t.nbcircuits == e.value && aScores[0] >= e.pts) return !0
                },
                next_circuit: function(e) {
                    e.nbcircuits++
                }
            },
            pts_equals: {
                verify: "end_game",
                initRuleVars: function() {
                    return clGlobalVars.nbcircuits ? {} : {
                        nbcircuits: 1
                    }
                },
                success: function(e, t) {
                    if (t.nbcircuits == e.value && aScores[0] == e.pts) return !0
                },
                next_circuit: function(e) {
                    e.nbcircuits++
                }
            },
            game_mode: {
                success: function(e) {
                    return course == ["VS", "CM"][e.value]
                }
            },
            game_mode_cup: {
                success: function(e) {
                    return course == ["GP", "VS"][e.value]
                }
            },
            difficulty: {
                success: function(e) {
                    return iDificulty == 4 + .5 * (2 - e.value)
                }
            },
            no_teams: {
                success: function(e) {
                    return !iTeamPlay
                }
            },
            participants: {
                success: function(e) {
                    return aKarts.length == e.value
                }
            },
            balloons: {
                success: function(e) {
                    if (oPlayers[0].lost && clLocalVars.gagnant != oPlayers[0]) return !1;
                    var t = clLocalVars.gagnant;
                    return t.ballons.length + t.reserve >= e.value
                }
            },
            balloons_lost: {
                success: function(e) {
                    return (!oPlayers[0].loose || clLocalVars.gagnant == oPlayers[0]) && clLocalVars.lostBalloons <= e.value
                }
            },
            no_drift: {
                success: function(e) {
                    return !clLocalVars.drifted
                }
            },
            avoid_items: {
                success: function(e) {
                    return !clLocalVars.itemsGot
                }
            },
            no_item: {
                success: function(e) {
                    return !clLocalVars.itemsUsed
                }
            },
            character: {
                success: function(e) {
                    return oPlayers[0].personnage == e.value
                }
            },
            falls: {
                initRuleVars: function() {
                    return {
                        falls: 0
                    }
                },
                success: function(e, t) {
                    if (t) return clLocalVars.falls + t.falls <= e.value
                },
                next_circuit: function(e) {
                    e && (e.falls += clLocalVars.falls)
                }
            },
            no_stunt: {
                success: function(e) {
                    return !clLocalVars.stunted
                }
            },
            time: {
                success: function(e) {
                    return 67 * (timer - 1) / 1e3 <= e.value
                }
            },
            time_delay: {
                initLocalVars: function(e) {
                    (!clLocalVars.delayedStart || clLocalVars.delayedStart > e.value) && (clLocalVars.delayedStart = e.value)
                },
                success: function(e) {
                    return !clLocalVars.startedAt || 67 * (clLocalVars.startedAt - 1) / 1e3 >= e.value
                }
            },
            position: {
                success: function(e) {
                    return oPlayers[0].place == e.value
                }
            },
            with_pts: {
                verify: "end_game",
                initRuleVars: function() {
                    return clGlobalVars.nbcircuits ? {} : {
                        firstAttempt: !0
                    }
                },
                success: function(e, t) {
                    if (t.firstAttempt && aScores[0] >= e.value) return !0
                }
            },
            different_circuits: {
                initRuleVars: function() {
                    return {
                        played_circuits: {}
                    }
                },
                success: function(e, t) {
                    return !t.played_circuits[oMap.ref]
                },
                next_circuit: function(e) {
                    e.played_circuits[oMap.ref] = !0
                }
            }
        };

    function addCreationChallenges(e, t) {
        var a = challenges[e][t];
        if (a)
            for (var n = a.list, o = 0; o < n.length; o++) {
                var i = n[o];
                if (!i.succeeded) {
                    var r = i.data,
                        l = challengeRules[r.goal.type].verify;
                    challengesForCircuit[l].push(i);
                    for (var s = listChallengeRules(r), c = 0; c < s.length; c++) initChallengeRule(i, s[c])
                }
            }
    }

    function listChallengeRules(e) {
        var t = e.constraints.slice(0);
        return t.unshift(e.goal), t
    }

    function initChallengeRule(e, t) {
        challengeRules[t.type].initRuleVars && (clRuleVars[e.id] || (clRuleVars[e.id] = {}), clRuleVars[e.id][t.type] || (clRuleVars[e.id][t.type] = challengeRules[t.type].initRuleVars(e)))
    }

    function reinitChallengeVars() {
        for (var e in challengesForCircuit)
            for (var t = challengesForCircuit[e], a = 0; a < t.length; a++)
                for (var n = t[a], o = listChallengeRules(n.data), i = 0; i < o.length; i++) initChallengeRule(n, o[i]);
        reinitLocalVars()
    }

    function reinitLocalVars() {
        for (var e in clLocalVars = {
                drifted: !1,
                stunted: !1,
                itemsGot: !1,
                itemsUsed: !1,
                falls: 0,
                lostBalloons: 0,
                cheated: !1
            }, challengesForCircuit)
            for (var t = challengesForCircuit[e], a = 0; a < t.length; a++)
                for (var n = listChallengeRules(t[a].data), o = 0; o < n.length; o++) {
                    var i = n[o];
                    challengeRules[i.type].initLocalVars && challengeRules[i.type].initLocalVars(i)
                }
    }

    function challengeCheck(e, t) {
        if (!(clLocalVars.cheated || 1 < strPlayer.length))
            for (var a = challengesForCircuit[e], n = 0; n < a.length; n++) {
                var o = a[n],
                    i = challengeRulesSatisfied(o);
                !0 === i ? (challengeSucceeded(o), a.splice(n, 1), n--) : !1 === i ? delete clRuleVars[o.id] : challengeHandleEvents(o, t)
            }
    }

    function challengeHandleEvents(e, t) {
        if (t) {
            var a = clRuleVars[e.id];
            if (a)
                for (var n = listChallengeRules(e.data), o = 0; o < t.length; o++)
                    for (var i = t[o], r = 0; r < n.length; r++) {
                        var l = n[r];
                        challengeRules[l.type][i] && challengeRules[l.type][i](a[l.type])
                    }
        }
    }

    function challengeRulesSatisfied(e) {
        for (var t = listChallengeRules(e.data), a = !0, n = 0; n < t.length; n++) {
            var o = challengeRuleSatisfied(e, t[n]);
            if (!1 === o) return !1;
            !0 !== o && (a = !1)
        }
        return !!a || null
    }

    function challengeRuleSatisfied(e, t) {
        var a = clRuleVars[e.id] ? clRuleVars[e.id][t.type] : void 0;
        return challengeRules[t.type].success(t, a)
    }

    function challengeSucceeded(a) {
        a.succeeded || (a.succeeded = !0, "pending_completion" === a.status && (a.status = "pending_publication"), delete clRuleVars[a.id], xhr("challengeSucceeded_.php", "id=" + a.id, function(e) {
            if (!e) return !1;
            var t;
            try {
                t = JSON.parse(e)
            } catch (e) {
                return !1
            }
            return showChallengePopup(a, t), !0
        }))
    }

    function showChallengePartialSuccess(e, t) {
        if (!document.getElementById("challenge-popup-" + e.id)) {
            var a = document.createElement("div");
            a.id = "challenge-popup-" + e.id, a.className = "challenge-popup challenge-popup-partial", a.style.width = 56 * iScreenScale + "px", a.style.left = 12 * iScreenScale + "px", a.style.top = Math.round(4.5 * iScreenScale) + "px", a.style.padding = Math.round(1.5 * iScreenScale) + "px", a.style.paddingBottom = 5 * iScreenScale + "px", a.style.border = "inset " + Math.round(.5 * iScreenScale) + "px #07B", a.style.fontSize = 2 * iScreenScale + "px", a.style.opacity = 0;
            var n = language ? "Challenge being completed" : "Défi en cours de réussite",
                o = e.description.main,
                i = language ? "Cups completed: " + t.nb + "/" + t.total : "Coupes réussies: " + t.nb + "/" + t.total,
                r = language ? "Caution, progress will be lost when you close the browser" : "Attention, toute progression sera perdue à la fermeture du navigateur.",
                l = language ? "Close" : "Fermer";
            a.innerHTML = '<div style="font-size: ' + Math.round(2 * iScreenScale) + 'px"><img src="images/cups/cup2.png" alt="star" class="pixelated" style="width:' + Math.round(2.5 * iScreenScale) + 'px" /> <h1 class="challenge-popup-title" style="margin:' + Math.round(iScreenScale / 2) + "px 0; font-size: " + Math.round(3.25 * iScreenScale) + 'px">' + n + '</h1></div><div class="challenge-popup-header" style="font-size: ' + Math.round(2.25 * iScreenScale) + 'px">' + o + '</div><div class="challenge-popup-award" style="margin:' + iScreenScale + 'px 0">' + i + "</div>" + (t.warning ? '<div class="challenge-popup-disclaimer" style="margin:' + iScreenScale + 'px 0">' + r + "</div>" : "") + '<div class="challenge-popup-close" style="font-size:' + 2 * iScreenScale + "px;bottom:" + iScreenScale + "px;right:" + Math.round(1.25 * iScreenScale) + 'px"><a href="javascript:closeChallengePopup(' + e.id + ');">' + l + "</a></div>";
            var s = document.getElementsByClassName("challenge-popup");
            s.length ? document.body.insertBefore(a, s[0]) : document.body.appendChild(a);
            var c = 0;
            ! function e() {
                c < 1 ? (a.style.opacity = c, c += .2, setTimeout(e, 40)) : a.style.opacity = 1
            }()
        }
    }

    function showChallengePopup(t, a) {
        if (!document.getElementById("challenge-popup-" + t.id)) {
            var e = a.pts,
                n = document.createElement("div");
            n.id = "challenge-popup-" + t.id, n.className = "challenge-popup", n.style.width = 56 * iScreenScale + "px", n.style.left = 12 * iScreenScale + "px", n.style.top = Math.round(4.5 * iScreenScale) + "px", n.style.padding = Math.round(1.5 * iScreenScale) + "px", n.style.paddingBottom = 5 * iScreenScale + "px", n.style.border = "inset " + Math.round(.5 * iScreenScale) + "px #7B0", n.style.fontSize = 2 * iScreenScale + "px", n.style.opacity = 0;
            var o = language ? "Challenge completed!" : "Défi réussi !",
                i = t.description.main,
                r = language ? "You receive a reward of <strong>" + e + " pt" + (2 <= e ? "s" : "") + "</strong>." : "Vous recevez <strong>" + e + " pt" + (2 <= e ? "s" : "") + "</strong> en récompense.",
                l = language ? "Your challenge points goes from <strong>" + a.pts_before + "</strong> to <strong>" + a.pts_after + "</strong>!" : "Vos points défis passent de <strong>" + a.pts_before + "</strong> à <strong>" + a.pts_after + "</strong> !",
                s = language ? "Close" : "Fermer";
            if (n.innerHTML = '<div style="font-size: ' + Math.round(2 * iScreenScale) + 'px"><img src="images/cups/cup1.png" alt="star" class="pixelated" style="width:' + Math.round(2.5 * iScreenScale) + 'px" /> <h1 class="challenge-popup-title" style="margin:' + Math.round(iScreenScale / 2) + "px 0; font-size: " + Math.round(3.25 * iScreenScale) + 'px">' + o + '</h1></div><div class="challenge-popup-header" style="font-size: ' + Math.round(2.25 * iScreenScale) + 'px">' + i + "</div>" + (e ? '<div class="challenge-popup-award" style="margin:' + iScreenScale + 'px 0">' + r + "<br />" + l + "</div>" : "") + (0 <= a.rating ? '<div class="challenge-rating" style="margin-left:' + Math.round(3.5 * iScreenScale) + "px;font-size:" + Math.round(2.5 * iScreenScale) + 'px">' + toLanguage("Rate this challenge:", "Notez ce défi :") + '<div class="challenge-rating-stars"></div><div class="challenge-rated">' + toLanguage("Thanks", "Merci") + "</div></div>" : "") + (a.publish ? '<div class="challenge-publish" style="margin:' + iScreenScale + 'px 0">' + toLanguage("You can now", "Vous pouvez maintenant") + ' <a href="javascript:publishChallenge(' + t.id + ')">' + toLanguage("publish challenge", "publier le défi") + "</a>.</div>" : "") + '<div class="challenge-popup-close" style="font-size:' + 2 * iScreenScale + "px;bottom:" + iScreenScale + "px;right:" + Math.round(1.25 * iScreenScale) + 'px"><a href="javascript:closeChallengePopup(' + t.id + ');">' + s + "</a></div>", 0 <= a.rating) {
                var c = n.getElementsByClassName("challenge-rating-stars");
                (c = c[0]).style.position = "relative", c.style.marginLeft = Math.round(.4 * iScreenScale) + "px", c.style.marginRight = Math.round(.4 * iScreenScale) + "px", c.style.top = Math.round(.4 * iScreenScale) + "px";
                var u = n.getElementsByClassName("challenge-rated");
                u = u[0];

                function p() {
                    for (var e = +this.rating, t = 0; t < e; t++) y[t].src = "images/star1.png";
                    for (t = e; t < 5; t++) y[t].src = "images/star0.png"
                }

                function d() {
                    for (var e = 0; e < a.rating; e++) y[e].src = "images/star1.png";
                    for (e = a.rating; e < 5; e++) y[e].src = "images/star0.png"
                }

                function m() {
                    var e = +this.rating;
                    a.rating = a.rating == e ? 0 : e, d(), u.style.visibility = "hidden", xhr("challengeRate.php", "challenge=" + t.id + "&rating=" + a.rating, function(e) {
                        return 1 == e && (u.style.visibility = "visible", !0)
                    })
                }
                for (var y = [], h = 0; h < 5; h++) {
                    var g = document.createElement("img");
                    g.alt = "S", g.src = "images/star0.png", g.style.width = 3 * iScreenScale + "px", g.style.marginLeft = Math.round(.4 * iScreenScale) + "px", g.style.marginRight = Math.round(.4 * iScreenScale) + "px", g.rating = h + 1, g.onmouseover = p, g.onmouseout = d, g.onclick = m, y[h] = g, c.appendChild(g)
                }
                d()
            }
            var f = document.getElementsByClassName("challenge-popup");
            f.length ? document.body.insertBefore(n, f[0]) : document.body.appendChild(n);
            var S = 0;
            ! function e() {
                S < 1 ? (n.style.opacity = S, S += .2, setTimeout(e, 40)) : n.style.opacity = 1
            }(), !pause && document.onkeydown && (clLocalVars.forcePause = !0, document.onkeydown({
                keyCode: findKeyCode("pause")
            }), delete clLocalVars.forcePause), (bMusic || iSfx) && (challengeMusic || ((challengeMusic = playSoundEffect("musics/events/challenge.mp3")).className = "", endGPMusic ? (pauseMusic(endGPMusic), challengeMusic.onended = function() {
                unpauseMusic(endGPMusic), challengeMusic = null
            }) : willPlayEndMusic ? (willPlayEndMusic = !1, challengeMusic.onended = function() {
                unpauseMusic(endingMusic), isEndMusicPlayed = !0, challengeMusic = null
            }) : isEndMusicPlayed ? (pauseMusic(endingMusic), challengeMusic.onended = function() {
                unpauseMusic(endingMusic), isEndMusicPlayed = !0, challengeMusic = null
            }) : challengeMusic.onended = function() {
                challengeMusic = null
            }))
        }
    }
    window.closeChallengePopup = function(e) {
        var t = document.getElementById("challenge-popup-" + e);
        if (t) {
            var a = 1;
            ! function e() {
                0 < a ? (t.style.opacity = a, a -= .2, setTimeout(e, 40)) : document.body.removeChild(t)
            }()
        }
    }, window.closeChallengePopup = function(e) {
        var t = document.getElementById("challenge-popup-" + e);
        if (t) {
            var a = 1;
            ! function e() {
                0 < a ? (t.style.opacity = a, a -= .2, setTimeout(e, 40)) : document.body.removeChild(t)
            }()
        }
    }, window.publishChallenge = function(e) {
        for (var t in challenges)
            for (var a in challenges[t])
                for (var n = challenges[t][a], o = n.list, i = 0; i < o.length; i++) o[i].id == e && (n.main ? openChallengeEditor() : document.location.href = "challenges.php?cl=" + n.id)
    };
    var COL_KART = 0,
        COL_OBJ = 1,
        collisionTest, collisionTeam, clLocalVars;

    function isHitSound(e) {
        return collisionTest == COL_OBJ || collisionTeam == e[2] && {
            x: e[3],
            y: e[4]
        }
    }

    function handleHit(e) {
        clLocalVars.myItems && clLocalVars.currentKart && clLocalVars.currentKart != oPlayers[0] && !clLocalVars.currentKart.tourne && -1 != clLocalVars.myItems.indexOf(e) && incChallengeHits(clLocalVars.currentKart)
    }

    function handleHit2(e, t) {
        e == oPlayers[0] && t != oPlayers[0] && incChallengeHits(t)
    }

    function incChallengeHits(e) {
        clLocalVars.nbHits++, "BB" == course && 1 == e.ballons.length && clLocalVars.killed && -1 == clLocalVars.killed.indexOf(e) && (clLocalVars.killed.push(e), clLocalVars.nbKills++), challengeCheck("each_hit")
    }

    function touche_banane(e, t, a) {
        for (var n = 0; n < bananes.length; n++) {
            var o = bananes[n];
            if (n != a && !o[5] && e > o[3] - 4 && e < o[3] + 4 && t > o[4] - 4 && t < o[4] + 4) return handleHit(o), detruit(bananes, n, isHitSound(o)), collisionTeam != o[2]
        }
        return !1
    }

    function touche_fauxobjet(e, t, a) {
        for (var n = 0; n < fauxobjets.length; n++) {
            var o = fauxobjets[n];
            if (n != a && !o[5] && e > o[3] - 4 && e < o[3] + 4 && t > o[4] - 4 && t < o[4] + 4) return handleHit(o), detruit(fauxobjets, n, isHitSound(o)), collisionTeam != o[2]
        }
        return !1
    }

    function touche_cverte(e, t, a) {
        for (var n = 0; n < carapaces.length; n++) {
            var o = carapaces[n];
            if (n != a && !o[5] && e > o[3] - 5 && e < o[3] + 5 && t > o[4] - 5 && t < o[4] + 5) return handleHit(o), detruit(carapaces, n, isHitSound(o)), collisionTeam != o[2]
        }
        return !1
    }

    function touche_crouge(e, t, a) {
        for (var n = 0; n < carapacesRouge.length; n++) {
            var o = carapacesRouge[n];
            if (!o[0][0].div.style.opacity && n != a && !o[5]) {
                if (-1 != o[7] && e == o[3] && t == o[4]) {
                    if (isOnline) detruit(carapacesRouge, n, isHitSound(o));
                    else {
                        handleHit(o);
                        for (n = 0; n < strPlayer.length; n++) o[0][n].div.style.opacity = .8
                    }
                    return collisionTeam != o[2]
                }
                if (-1 == o[7] && e > o[3] - 5 && e < o[3] + 5 && t > o[4] - 5 && t < o[4] + 5) return handleHit(o), detruit(carapacesRouge, n, isHitSound(o)), collisionTeam != o[2]
            }
        }
        return !1
    }

    function touche_bobomb(e, t, a) {
        for (var n = 0; n < bobombs.length; n++) {
            var o = bobombs[n];
            if (!o[5] && n != a)
                if (-1 != o[6]) {
                    var i = 30;
                    if (38 <= o[8] ? i = 0 : 30 <= o[8] && (i = 5), !o[7] && e > o[3] - i && e < o[3] + i && t > o[4] - i && t < o[4] + i) {
                        if (o[8] <= 0) {
                            var r = collisionTeam != o[2] && (o[8] < -5 ? 42 : 84);
                            return r && handleHit(o), r
                        }
                        o[8] = 1
                    }
                } else if (e > o[3] - 5 && e < o[3] + 5 && t > o[4] - 5 && t < o[4] + 5) {
                var l;
                for (j = 0; j < aKarts.length; j++) aKarts[j].using[0] == bobombs && n == aKarts[j].using[1] && (aKarts[j].using = [!1], l = aKarts[j], j = aKarts.length);
                addNewItem(l, bobombs, [new Sprite("bob-omb"), -1, o[2], o[3], o[4], o[5], 1, 0, 1]), detruit(bobombs, n), n--
            }
        }
        return !1
    }

    function touche_cbleue(e, t) {
        for (var a = 0; a < carapacesBleue.length; a++) {
            var n = carapacesBleue[a];
            if (n[6] < 0 && -10 <= n[6] && e > n[3] - 30 && e < n[3] + 30 && t > n[4] - 30 && t < n[4] + 30) {
                var o = collisionTeam != n[2] && (n[6] < -5 ? 42 : 84);
                return o && handleHit(n), o
            }
        }
        return !1
    }

    function colKart(e) {
        for (var t = 0; t < aKarts.length; t++) {
            var a = aKarts[t];
            friendlyFire(a, e) || !(Math.pow(a.x - e.x, 2) + Math.pow(a.y - e.y, 2) < 25) || a.tourne || a.loose || a.protect && (!a.megachampi || e.megachampi) || (handleHit2(e, a), loseBall(t), stopDrifting(t), a.spin(62), a.using[0] && (a.using[0][a.using[1]][5] && (a.using[0][a.using[1]][5] = 0), a.using = [!1]), supprArme(t))
        }
    }

    function distKart(e) {
        for (var t = 1 / 0, a = 0; a < oPlayers.length; a++) {
            var n = oPlayers[a];
            if (kartIsPlayer(n) && !finishing) {
                var o = Math.hypot(e.x - n.x, e.y - n.y);
                o < t && (t = o)
            }
        }
        return t
    }

    function stuntKart(e) {
        e.figstate = 21, e.z += 1, e.heightinc += .5, e == oPlayers[0] && (clLocalVars.stunted = !0), playIfShould(e, "musics/events/stunt.mp3")
    }

    function places(e, t) {
        for (var a = aKarts[e], n = !t, o = 0; o < strPlayer.length; o++) oPlayers[o].cpu || oPlayers[o].loose || (n = !1);
        if (!n) {
            var i = 1;
            if ("BB" != course) {
                if (a.tours > oMap.tours || !oMap.checkpoint.length) return;
                var r = a.demitours + 1;
                r >= oMap.checkpoint.length && (r = 0);
                var l = oMap.checkpoint[r][3],
                    s = a.tours * oMap.checkpoint.length + getCpScore(a) - Math.abs(a[l ? "y" : "x"] - oMap.checkpoint[r][l]) / 1e3;
                for (o = 0; o < aKarts.length; o++) {
                    var c = aKarts[o];
                    (r = c.demitours + 1) >= oMap.checkpoint.length && (r = 0), l = oMap.checkpoint[r][3], c != a && c.tours * oMap.checkpoint.length + getCpScore(c) - Math.abs(c[l ? "y" : "x"] - oMap.checkpoint[r][l]) / 1e3 > s && i++
                }
            } else
                for (o = 0; o < aKarts.length; o++) {
                    var u = a.ballons.length ? a.ballons.length + a.reserve : 0,
                        p = aKarts[o].ballons.length ? aKarts[o].ballons.length + aKarts[o].reserve : 0;
                    (aKarts[o] != a && u < p || u == p && a.initialPlace > aKarts[o].initialPlace) && i++
                }
            a.loose || (a.place = i), e < strPlayer.length && (document.getElementById("infoPlace" + e).innerHTML = toPlace(i))
        }
    }

    function getLastCp(e) {
        return oMap.sections ? 1 < e.tours && e.tours <= oMap.tours ? oMap.sections[e.tours - 2] : oMap.checkpoint.length - 1 : 0
    }

    function getNextCp(e) {
        return oMap.sections ? e.tours <= oMap.sections.length ? oMap.sections[e.tours - 1] : oMap.checkpoint.length - 1 : 0
    }

    function getCpDiff(e) {
        var t = getLastCp(e),
            a = getNextCp(e) - t;
        return a <= 0 && (a += oMap.checkpoint.length), a
    }

    function getCpScore(e) {
        var t = getLastCp(e),
            a = e.demitours - t;
        return a < 0 && (a += oMap.checkpoint.length), a
    }

    function distanceToFirst(e) {
        aKarts.length;
        for (var t = 1, a = 0; a < aKarts.length; a++)
            if (aKarts[a].place == t) {
                if (aKarts[a].tours <= oMap.tours) {
                    a;
                    break
                }
                t++, a = -1
            } if (-1 == a) return 0;
        var n = aKarts[a],
            o = e.tours,
            i = e.demitours,
            r = 0,
            l = e.x,
            s = e.y;
        for (oMap.sections && (o = n.tours); o < n.tours || o == n.tours && i < n.demitours;) {
            ++i >= oMap.checkpoint.length && (i = 0, o++);
            var c = oMap.checkpoint[i],
                u = c[0] + (c[3] ? Math.round(c[2] / 2) : 8),
                p = c[1] + (c[3] ? 8 : Math.round(c[2] / 2));
            r += Math.hypot(u - l, p - s), l = u, s = p
        }
        return r += Math.hypot(n.x - l, n.y - s)
    }

    function checkpoint(e) {
        var t = e.demitours;
        if (!simplified) var a = getNextCp(e),
            n = (a || oMap.checkpoint.length) - 1;
        for (var o = 0; o < oMap.checkpoint.length; o++) {
            var i = oMap.checkpoint[o];
            if (e.x > i[0] && e.x < i[0] + (i[3] ? i[2] : 15) && e.y > i[1] && e.y < i[1] + (i[3] ? 15 : i[2]))
                if (simplified) {
                    if (0 == o && oMap.checkpoint.length - t < 5) return !0;
                    if (t == o - 1 || t && Math.abs(t - o) < 5) return e.demitours = o, !1
                } else {
                    if (o == a && t == n) return !0;
                    if (t == o - 1 || t == o + 1) return e.demitours = o, !1;
                    if (0 == o && t == oMap.checkpoint.length - 1) return e.demitours = o, !1
                }
        }
        return !1
    }

    function resetDatas() {
        for (var oPlayer = oPlayers[0], params = "BB" != course ? ["x", "y", "z", "speed", "speedinc", "heightinc", "rotation", "rotincdir", "rotinc", "size", "tourne", "tombe", "tours", "demitours", "champi", "etoile", "megachampi", "billball", "eclair", "place"] : ["x", "y", "z", "speed", "speedinc", "heightinc", "rotation", "rotincdir", "rotinc", "size", "tourne", "tombe", "ballons", "reserve", "champi", "etoile", "megachampi"], paramsExcept = ["demitours", "ballons"], eParams = {}, i = 0; i < paramsExcept.length; i++) eParams[paramsExcept[i]] = !0;
        for (var uSend = "", i = 0; i < params.length; i++) eParams[params[i]] || (uSend += params[i] + "=" + oPlayer[params[i]] + "&");
        "BB" == course ? uSend += "ballons=" + oPlayer.ballons.length + "&battle=1&" : (uSend += "demitours=" + getCpScore(oPlayer) + "&", 3 != oMap.tours && (uSend += "laps=" + oMap.tours + "&"));
        var iObjets = [bananes, fauxobjets, carapaces, carapacesRouge, carapacesBleue, bobombs];
        oPlayer.using[0] && (uSend += "i=" + iObjets.indexOf(oPlayer.using[0]) + "&j=" + oPlayer.using[0][oPlayer.using[1]][1] + "&");
        var alpha = "abcdef",
            idObjets = new Array;
        for (i = 0; i < iObjets.length; i++) {
            idObjets[i] = new Array;
            for (var j = 0; j < iObjets[i].length; j++) idObjets[i][j] = iObjets[i][j][1]
        }
        for (nbNews = new Array, i = 0; i < iObjets.length; i++) {
            var iObjet = iObjets[i],
                lettre = alpha.charAt(i);
            for (nbNews[i] = new Array, j = 0; j < iObjet.length; j++) {
                for (var cObjet = iObjet[j], k = 1; k < cObjet.length; k++) uSend += lettre + j + "_" + (k - 1) + "=" + cObjet[k] + "&"; - 1 == cObjet[1] && nbNews[i].push(j)
            }
        }
        for (i = 0; i < destructions.length; i++) {
            var lettre = alpha.charAt(i);
            for (j = 0; j < destructions[i].length; j++) uSend += lettre + j + "=" + destructions[i][j] + "&";
            destructions[i] = new Array
        }
        xhr("reload.php", uSend, function(reponse) {
            if (refreshDatas = !0, reponse)
                if (-1 != reponse) try {
                    var rCode = eval(reponse),
                        aCodes = rCode[1];
                    for (i = 0; i < aCodes.length; i++)
                        for (j = 0; j < nbNews[i].length; j++) iObjets[i][nbNews[i]][1] = idObjets[i][nbNews[i]] = aCodes[i][aCodes[i].length - nbNews[i].length + j][0];
                    var strSprites = ["banane", "objet", "carapace", "carapace-rouge", "carapace-bleue", "bob-omb"];
                    for (i = 0; i < aCodes.length; i++)
                        for (j = 0; j < aCodes[i].length; j++) {
                            for (var aID = aCodes[i][j][0], inArray = !0, k = 0; k < idObjets[i].length; k++)
                                if (idObjets[i][k] == aID) {
                                    inArray = !1;
                                    break
                                } if (inArray) {
                                var strSprite = strSprites[i];
                                "carapace" == strSprite && -1 == aCodes[i][j][6] && (strSprite = "carapace-rouge");
                                var toAdd = [new Sprite(strSprite), aID];
                                for (k = 1; k < aCodes[i][j].length; k++) toAdd.push(aCodes[i][j][k]);
                                addNewItem(null, iObjets[i], toAdd)
                            }
                        }
                    for (i = 0; i < iObjets.length; i++)
                        for (j = 0; j < iObjets[i].length; j++) {
                            var oID = iObjets[i][j][1];
                            if (-1 != oID) {
                                var inArray = !0;
                                for (k = 0; k < aCodes[i].length; k++)
                                    if (aCodes[i][k][0] == oID) {
                                        inArray = !1;
                                        break
                                    } inArray && (supprime(iObjets[i], j), j--)
                            }
                        }
                    var jCodes = rCode[0];
                    for (i = 0; i < jCodes.length; i++) {
                        var jCode = jCodes[i];
                        if (jCode[0][1] >= connecte) {
                            var pID = jCode[0][0];
                            for (j = 0; j < aKarts.length; j++)
                                if (aKarts[j].id == pID) {
                                    var pCode = jCode[1],
                                        aEtoile = aKarts[j].etoile,
                                        aBillBall = aKarts[j].billball,
                                        aEclair = aKarts[j].eclair,
                                        aTombe = aKarts[j].tombe,
                                        extraParams = {};
                                    for (k = 0; k < params.length; k++) eParams[params[k]] ? extraParams[params[k]] = pCode[k] : aKarts[j][params[k]] = pCode[k];
                                    if ("BB" == course) {
                                        for (; aKarts[j].ballons.length < extraParams.ballons;) aKarts[j].ballons.length || (aKarts[j].sprite[0].div.style.opacity = 1, aKarts[j].sprite[0].img.style.display = "", oPlanCharacters[j].style.display = "block", oPlanCharacters2[j].style.display = "block", aKarts[j].loose = !1), addNewBalloon(aKarts[j]);
                                        for (; aKarts[j].ballons.length > extraParams.ballons;) {
                                            var lg = aKarts[j].ballons.length - 1;
                                            aKarts[j].ballons[lg][0].suppr(), aKarts[j].ballons.pop()
                                        }
                                    } else aKarts[j].demitours = (getLastCp(aKarts[j]) + extraParams.demitours) % oMap.checkpoint.length;
                                    if (40 <= aKarts[j].billball && !aBillBall ? (aKarts[j].sprite[0].img.src = "images/sprites/sprite_billball.png", aKarts[j].aipoint = void 0) : 50 <= aKarts[j].etoile && !aEtoile ? aKarts[j].sprite[0].img.src = getStarSrc(aKarts[j].personnage) : (aEtoile && !aKarts[j].etoile || aBillBall && !aKarts[j].billball) && (aKarts[j].sprite[0].img.src = getSpriteSrc(aKarts[j].personnage)), 90 <= aKarts[j].eclair && !aEclair) {
                                        for (k = 0; k < aKarts.length; k++) {
                                            var kart = aKarts[k];
                                            friendlyFire(kart, aKarts[j]) || (kart.protect ? kart.megachampi = kart.megachampi < 8 || kart.etoile ? kart.megachampi : 8 : (kart.size = .6, updateDriftSize(k), kart.arme = !1, kart.using[0] && (kart.using[0][kart.using[1]][5] && (kart.using[0][kart.using[1]][5] = 0), kart.using = [!1]), kart.champi = 0, kart.spin(20), kart.roulette = 0, stopDrifting(k), supprArme(k)))
                                        }
                                        document.getElementById("mariokartcontainer").style.opacity = .7, !iSfx || finishing || oPlayers[0].cpu || playSoundEffect("musics/events/lightning.mp3")
                                    } else aEclair && !aKarts[j].eclair && oPlayers[0].size < 1 && (oPlayers[0].size = 1, updateDriftSize(j), document.getElementById("mariokartcontainer").style.opacity = 1);
                                    if (aKarts[j].protect = aKarts[j].etoile || aKarts[j].megachampi || aKarts[j].billball, aTombe && !aKarts[j].tombe && (aKarts[j].sprite[0].img.style.display = "block", "BB" == course))
                                        for (var k = 0; k < aKarts[j].ballons.length; k++) aKarts[j].ballons[k][0].img.style.display = "block";
                                    if (!aTombe && aKarts[j].tombe && (aKarts[j].sprite[0].img.style.display = "none", 2 < aKarts[j].tombe)) {
                                        if ("BB" == course)
                                            for (var k = 0; k < aKarts[j].ballons.length; k++) aKarts[j].ballons[k][0].img.style.display = "none";
                                        aKarts[j].marker && (aKarts[j].marker.div[0].style.display = "none")
                                    }!aKarts[j].turnSound && aKarts[j].tourne && (aKarts[j].turnSound = playDistSound(aKarts[j], "musics/events/spin.mp3", "BB" == course ? 80 : 50)), aKarts[j].turnSound && !aKarts[j].tourne && (aKarts[j].turnSound = void 0);
                                    var uID = jCode[0][3];
                                    if (-1 == uID) aKarts[j].using = [!1];
                                    else {
                                        aKarts[j].using = [!1];
                                        var iObjet = iObjets[jCode[0][2]];
                                        for (k = 0; k < iObjet.length; k++)
                                            if (uID == iObjet[k][1]) {
                                                aKarts[j].using = [iObjets[jCode[0][2]], k];
                                                break
                                            }
                                    }
                                    for (k = jCode[0][1]; k < rCode[2]; k++) move(j);
                                    break
                                }
                        }
                    }
                    if (connecte = rCode[2], rCode[3]) {
                        function displayRankings() {
                            var e = oPlayers[0];
                            "BB" == course && (e.arme = !1, supprArme(e.speed = 0)), e.speedinc = 0, e.rotinc = 0, e.rotincdir = 0, e.sprite[0].setState(0), stopDrifting(0);
                            var s = document.getElementById("infos0");
                            s.innerHTML = "", s.style.border = "solid 1px black", s.style.opacity = .7, s.style.fontSize = Math.round(1.5 * iScreenScale + 4) + "pt", s.style.fontFamily = "Courier", s.style.top = 3 * iScreenScale + "px", s.style.left = Math.round(25 * iScreenScale + 10) + "px", s.style.backgroundColor = iTeamPlay ? "blue" : "#063", s.style.color = "yellow";
                            var c = new Array,
                                u = new Array;
                            for (i = 0; i < rCode[3].length; i++) {
                                var t = rCode[3][i],
                                    a = document.createElement("tr");
                                u[i] = new Array, t[0] == identifiant ? (a.style.backgroundColor = rankingColor(oPlayers[0].team), document.getElementById("infoPlace0").innerHTML = toPlace(i + 1), document.getElementById("infoPlace0").style.visibility = "visible") : 1 == t[4] && (a.style.backgroundColor = "red"), (o = document.createElement("td")).innerHTML = toPlace(i + 1), u[i][0] = document.createElement("td"), u[i][0].innerHTML = t[1], u[i][1] = document.createElement("td"), u[i][1].innerHTML = t[2];
                                var n = document.createElement("small");
                                n.innerHTML = (t[3] < 0 ? "" : "+") + t[3], a.appendChild(o), a.appendChild(u[i][0]), u[i][1].appendChild(n), a.appendChild(u[i][1]), s.appendChild(a), c[i] = a
                            }
                            var o;
                            a = document.createElement("tr");
                            (o = document.createElement("td")).setAttribute("colspan", 3);
                            var p = document.createElement("input");
                            p.type = "button", p.value = toLanguage("CONTINUE", "CONTINUER"), p.style.width = "100%", p.style.height = "100%", p.style.fontSize = 3 * iScreenScale + "pt";
                            var r = !0;

                            function l() {
                                s.style.visibility = "hidden";
                                for (var e = 0; e < rCode[3].length; e++) rCode[3][e][2] += rCode[3][e][3];
                                var t = rCode[3].length - 1;
                                for (e = 0; e < t; e++) {
                                    for (var a = 0, n = 0, o = e; o < rCode[3].length; o++) rCode[3][o][2] >= a && (a = rCode[3][o][2], n = o);
                                    var i = rCode[3][e];
                                    rCode[3][e] = rCode[3][n], rCode[3][n] = i
                                }
                                for (e = 0; e < u.length; e++) {
                                    var r = rCode[3][e];
                                    u[e][0].innerHTML = toPerso(r[1]), u[e][1].innerHTML = r[2], r[0] == identifiant ? c[e].style.backgroundColor = rankingColor(oPlayers[0].team) : 1 == r[4] ? c[e].style.backgroundColor = "red" : c[e].style.backgroundColor = ""
                                }
                                var l = !0;
                                setTimeout(function() {
                                    s.style.visibility = "visible", isChatting() || p.focus()
                                }, 500), setTimeout(function() {
                                    l && continuer()
                                }, 5e3), p.onclick = function() {
                                    l = !1, continuer()
                                }
                            }
                            p.onclick = function() {
                                r = !1, l()
                            }, setTimeout(function() {
                                r && l()
                            }, 5e3), o.appendChild(p), a.appendChild(o), s.appendChild(a), s.style.visibility = "visible", isChatting() || p.focus(), document.onkeydown = void 0, document.onkeyup = void 0, document.onmousedown = void 0, window.onbeforeunload = void 0, window.removeEventListener("blur", window.releaseOnBlur), window.releaseOnBlur = void 0, supprArme(0), (bMusic || iSfx) && startEndMusic(), finishing = !0, document.getElementById("racecountdown").innerHTML = rCode[4] - ("BB" == course ? 6 : 5), document.getElementById("waitrace").style.visibility = "visible", dRest(), document.getElementById("compteur0").innerHTML = "", document.getElementById("roulette0").innerHTML = "", document.getElementById("scroller0").style.visibility = "hidden";
                            var d = document.getElementById("lakitu0");
                            d && (d.style.display = "none")
                        }
                        if (refreshDatas = !1, "BB" == course) {
                            for (var firstID = rCode[3][0][0], firstTeam = rCode[3][0][4], i = 0; i < aKarts.length; i++) {
                                var oKart = aKarts[i];
                                if ((iTeamPlay ? oKart.team != firstTeam : oKart.id != firstID) && oKart.ballons.length && !oKart.tourne) {
                                    do {
                                        var lg = oKart.ballons.length - 1;
                                        oKart.ballons[lg][0].suppr(), oKart.ballons.pop()
                                    } while (oKart.ballons.length);
                                    oKart.spin(20), oKart != oPlayers[0] && playDistSound(oKart, "musics/events/spin.mp3", "BB" == course ? 80 : 50)
                                }
                            }
                            setTimeout(displayRankings, 1e3)
                        } else displayRankings()
                    }
                } catch (e) {
                    return !0
                } else iDeco(), pause = !0;
            return !0
        }), refreshDatas = !1
    }

    function loseBall(e) {
        if ("BB" == course) {
            var t = aKarts[e].ballons.length - 1;
            !aKarts[e].tourne && aKarts[e].ballons[t] && (aKarts[e].ballons[t][0].suppr(), aKarts[e].ballons.pop(), aKarts[e].cpu || clLocalVars.lostBalloons++, !isOnline || e || aKarts[e].ballons.length || (supprArme(e), document.getElementById("infoPlace0").style.visibility = "hidden"))
        }
    }

    function showTimer() {
        var e = timer / 1e3 * 67,
            t = Math.floor(e),
            a = Math.round(1e3 * (e - t)),
            n = Math.floor(t / 60);
        (t -= 60 * n) < 10 && (t = "0" + t), a < 10 ? a = "00" + a : a < 100 && (a = "0" + a);
        for (var o = toLanguage("&nbsp;Time", "Temps") + ": " + n + ":" + t + "." + a, i = 0; i < strPlayer.length; i++) document.getElementById("temps" + i).innerHTML = o
    }

    function move(e) {
        var t = aKarts[e];
        collisionTest = COL_KART, collisionTeam = -1 == t.team ? void 0 : t.team, clLocalVars.currentKart = t;
        t = aKarts[e];
        if (e < strPlayer.length && !t.cpu && !finishing && (showTimer(), e || timer++, t.time && (t.time--, document.getElementById("lakitu" + e).style.left = Math.round(iScreenScale * (20 - t.time / 5) + 10 + e * (iWidth * iScreenScale + 2)) + "px", document.getElementById("lakitu" + e).style.top = Math.round((20 - Math.abs(t.time - 20)) * (iScreenScale - 2)) + "px", t.time && !oPlayers[e].changeView ? document.getElementById("lakitu" + e).style.display = "block" : document.getElementById("lakitu" + e).style.display = "none")), t.tombe) {
            if (t.tombe--, updateDriftSize(e), t.size = 1, 19 == t.tombe && playIfShould(t, "musics/events/rescue.mp3"), 2 == t.tombe) {
                if ("BB" == course)
                    for (var r = 0; r < strPlayer.length; r++)
                        for (var a = 0; a < t.ballons.length; a++) t.ballons[a][r].img.style.display = "block"
            } else if (!t.tombe) {
                if (loseBall(e), "BB" == course) {
                    if (t.cpu && 1 == t.ballons.length) {
                        var n = 1 + Math.round(Math.random());
                        for (r = 0; r < n && t.reserve; r++) addNewBalloon(t), t.reserve--
                    }
                    if (!t.ballons.length && !t.loose)
                        for (r = 0; r < strPlayer.length; r++) t.sprite[r].div.style.opacity = 1
                }
                for (r = 0; r < strPlayer.length; r++) t.sprite[r].img.style.display = "block"
            }
            t == oPlayers[e] && (oContainers[e].style.opacity = Math.abs(t.tombe - 10) / 10)
        } else {
            if (t.rotincdir ? t.rotinc += 2 * t.rotincdir : t.rotinc < 0 ? t.rotinc = Math.min(0, t.rotinc + 1) : 0 < t.rotinc && (t.rotinc = Math.max(0, t.rotinc - 1)), t.driftinc ? (t.rotincdir && (0 < t.rotincdir == 0 < t.driftinc ? (t.drift += 0 < t.rotincdir ? 1 : -1, 4 < t.drift ? t.drift = 4 : t.drift < -4 && (t.drift = -4)) : 0 < t.rotincdir ? (t.drift++, 0 < t.drift && (t.drift = 0)) : (t.drift--, t.drift < 0 && (t.drift = 0))), t.driftcpt < 15 && (t.driftcpt++, 15 <= t.driftcpt && (getDriftImg(e).src = "images/turbo-drift.png", carSpark && t != oPlayers[1] && (carSpark.currentTime = 0, carSpark.play(), t.sparkSound = carSpark)))) : t.drift && (t.drift < 0 ? t.drift = Math.min(0, t.drift + .75) : 0 < t.drift && (t.drift = Math.max(0, t.drift - .75))), t.rotinc = Math.min(t.rotinc, fMaxRotInc), t.rotinc = Math.max(t.rotinc, -fMaxRotInc), t.tourne || !t.speed || t.billball || t.figstate || t.driftinc && t.rotincdir && 0 < t.rotincdir != 0 < t.driftinc)
                if (t.tourne) {
                    if (t.figuring = !1, t.figstate = 0, t.speed = t.speed / 1.2 - t.speedinc, t.tourne -= 2, "BB" == course && !t.tourne) {
                        if (t.cpu && 1 == t.ballons.length) {
                            n = 1 + Math.round(Math.random());
                            for (r = 0; r < n && t.reserve; r++) addNewBalloon(t), t.reserve--
                        }
                        if (!t.ballons.length && !t.loose)
                            for (r = 0; r < strPlayer.length; r++) t.sprite[r].div.style.opacity = 1
                    }
                } else t.figstate && (t.figstate -= 1 + Math.round(.5 * (11 - Math.abs(11 - t.figstate))), t.figstate < 0 && (t.figstate = 0), t.figstate < 8 && (t.figuring = !0));
            else t.rotation += (t.speedinc < 0 || 0 == t.speedinc && t.speed < 0 ? -t.rotinc : t.rotinc) * Math.cos(angleDrift(t) * Math.PI / 180);
            if (t.rotation < 0 && (t.rotation += 360), 360 < t.rotation && (t.rotation -= 360), kartIsPlayer(t)) {
                !clLocalVars.startedAt && 1 < t.speed && (clLocalVars.startedAt = timer);
                var o = t.sprite[e];
                if (t.changeView)
                    if (t.tourne) {
                        var i = t.tourne % 21;
                        o.setState(i + (i < 11 ? 11 : -11))
                    } else o.setState(11);
                else t.figstate ? o.setState((21 - t.figstate) % 21) : t.driftinc ? o.setState(0 < t.driftinc ? 18 : 4) : t.rotincdir && !t.tourne ? o.setState(0 < t.rotincdir ? 23 : 22) : o.setState(t.tourne % 21)
            }
            var l = t.maxspeed * t.size;
            t.speed > l && (t.speed = l), t.speed < -l / 4 && (t.speed = -l / 4);
            var s, c = t.rotation - angleDrift(t),
                u = t.speed * direction(0, c),
                p = t.speed * direction(1, c),
                d = t.x + u,
                m = t.y + p,
                y = t.x,
                h = t.y,
                g = Math.round(d),
                f = Math.round(m);
            if (t.z || t.heightinc ? (t.z += .7 * t.heightinc * Math.abs(t.heightinc), t.heightinc -= .5, t.z <= 0 && (t.heightinc = 0, t.z = 0, kartIsPlayer(t) && (t.jumped = !1, t.driftinc && (document.getElementById("drift" + e).style.display = "block", carDrift && !t.driftSound && (carDrift.currentTime = 0, carDrift.play(), t.driftSound = carDrift)))), t.driftinc && (document.getElementById("drift" + e).style.top = Math.round(iScreenScale * (32 - correctZ(t.z)) + 10) + "px")) : (t.speed += t.speedinc, isCup && 22 != oMap.skin && 30 != oMap.skin && t.cpu && (tombe(g, f) && !sauts(y, h, u, p) || 2.5 < t.speed && oMap.horspistes.herbe && ralenti(g, f) && !t.protect && !t.champi) && (t.z = 1, t.heightinc = .5)), (!e || !isOnline || finishing) && !t.loose) {
                var S = touche_bobomb(g, f, t.using[0] == bobombs ? t.using[1] : -1) + touche_cbleue(g, f);
                !S || t.tourne || t.protect ? t.z < 5 && ((touche_fauxobjet(g, f, t.using[0] == fauxobjets ? t.using[1] : -1) || touche_cverte(g, f, t.using[0] == carapaces ? t.using[1] : -1) || touche_cverte(Math.round(t.x), Math.round(t.y), t.using[0] == carapaces ? t.using[1] : -1) || touche_crouge(Math.round(t.x), Math.round(t.y), t.using[0] == carapacesRouge ? t.using[1] : -1)) && !t.protect ? (loseBall(e), stopDrifting(e), t.spin(42), t.using = [!1]) : touche_banane(g, f, t.using[0] == bananes ? t.using[1] : -1) && !t.protect && (loseBall(e), stopDrifting(e), t.spin(20), t.using[0] && (t.using[0][t.using[1]][5] && (t.using[0][t.using[1]][5] = 0), t.using = [!1]))) : (loseBall(e), t.spin(S), t.using[0] && (t.using[0][t.using[1]][5] && (t.using[0][t.using[1]][5] = 0), t.using = [!1]), stopDrifting(e), 84 == S && (t.speed = 0, t.heightinc = 3, supprArme(e)))
            }
            if (kartIsPlayer(t)) {
                var b, v = (b = document.getElementById("scroller" + e).getElementsByTagName("div")[0]).offsetHeight;
                s = 7 * iScreenScale
            }
            if (objet(g, f) && (t.destroySound || (t.destroySound = playDistSound(t, "musics/events/item_destroy.mp3", 80), t.destroySound && (t.destroySound.onended = function() {
                    t.destroySound = void 0, document.body.removeChild(this)
                })), !t.arme && (t.tours <= oMap.tours || "BB" == course) && !t.billball && !finishing)) {
                var C;
                if ("BB" != course) {
                    if (C = randObj(t), 1 == t.tours && getCpScore(t) <= getCpDiff(t) / 2) {
                        if (otherObjects(t, ["carapacebleue", "eclair"]))
                            for (;
                                "carapacebleue" == C || "eclair" == C;) C = randObj(t)
                    } else
                        for (r = 0; r < aKarts.length; r++)
                            if ("carapacebleue" == aKarts[r].arme) {
                                if (otherObjects(t, ["carapacebleue"]))
                                    for (;
                                        "carapacebleue" == C;) C = randObj(t);
                                break
                            }
                } else if (t.ballons.length)
                    for (;
                        "billball" == (C = objets[Math.floor(75 * Math.random())]) || "carapacebleue" == C && (1 == t.place || timer < 500););
                else {
                    var M = ["fauxobjet", "banane", "carapace", "bobomb"];
                    C = M[Math.floor(Math.random() * M.length)]
                }
                t.arme = C, shouldPlaySound(t) && (t.rouletteSound = playSoundEffect("musics/events/roulette.mp3")), kartIsPlayer(t) && (document.getElementById("scroller" + e).getElementsByTagName("div")[0].style.top = -Math.floor(Math.random() * v) + "px", document.getElementById("scroller" + e).style.visibility = "visible", clLocalVars.itemsGot = !0)
            }
            if (t.arme && 25 != t.roulette) {
                if (kartIsPlayer(t)) {
                    var x = parseInt(b.style.top) + 3 * iScreenScale;
                    0 < x && (x += s - v), b.style.top = x + "px"
                }
                t.roulette++, 25 <= t.roulette && (t.roulette = 25, kartIsPlayer(t) && (document.getElementById("scroller" + e).style.visibility = "hidden", document.getElementById("roulette" + e).innerHTML = '<img alt="." class="pixelated" src="images/items/' + t.arme + '.gif" style="width: ' + Math.round(8 * iScreenScale - 3) + 'px;" />', t.rouletteSound && (removeIfExists(t.rouletteSound), playSoundEffect("musics/events/gotitem.mp3"), t.rouletteSound = void 0)))
            }
            if ("MK" == page && "BB" == course && t.cpu || 1.175 < t.z || canMoveTo(y, h, u, p, t.protect)) t.x = d, t.y = m;
            else {
                t.speed *= -1, t.collideSound || (t.collideSound = playIfShould(t, "musics/events/collide.mp3"), t.collideSound && (t.collideSound.onended = function() {
                    t.collideSound = void 0, document.body.removeChild(this)
                }));
                var P = getHorizontality(y, h, u, p);
                if (t.cpu) t.horizontality = P;
                else if (t.speed < -.2) {
                    var k = (t.x - d) * P[0] + (t.y - m) * P[1];
                    for (r = 5; 0 < r && (t.x += P[0] * k * r / t.speed, t.y += P[1] * k * r / t.speed, !canMoveTo(y, h, t.x - y, t.y - h, t.protect)); r--) t.x = y, t.y = h
                }
            }
            if (t.speedinc || (t.speed *= t.sliding ? .95 : .9), t.sliding = void 0, !t.z)
                if (t.heightinc || (t.ctrled = !1, t.fell = !1), t.figuring && (t.turbodrift = 15, t.driftcpt = 0), (j = sauts(y, h, u, p)) && !t.tourne) t.heightinc = 1.5 * j, t.speed = 11, t.figuring = !1, t.figstate = 0, t.bounceSound || (t.bounceSound = playIfShould(t, "musics/events/jump.mp3"), t.bounceSound && (t.bounceSound.onended = function() {
                    t.bounceSound = void 0, document.body.removeChild(this)
                }));
                else {
                    var E, I;
                    if (isOnline && e || "MK" == page && "BB" == course && t.cpu || (I = tombe(Math.round(t.x), Math.round(t.y), oMap.checkpoint && t.demitours ? oMap.checkpoint[t.demitours + 1 != oMap.checkpoint.length ? t.demitours + 1 : 0][3] : 0)), I) {
                        if (1 == I ? isBattle && simplified ? (I = [t.x, t.y, t.rotation], t.x > oMap.w - 1 ? (I[0] = oMap.w - 50, t.y > oMap.h - 1 ? (I[1] = oMap.h - 50, I[2] = 225) : t.y < 0 ? (I[1] = 50, I[2] = 315) : (I[1] = t.y - t.y % 100 + 50, I[2] = 270)) : t.y > oMap.h - 1 ? (I[1] = oMap.h - 50, t.x < 0 ? (I[0] = 50, I[2] = 135) : (I[0] = t.x - t.x % 100 + 50, I[2] = 180)) : t.x < 0 ? (I[0] = 50, t.y < 0 ? (I[1] = 50, I[2] = 45) : (I[1] = t.y - t.y % 100 + 50, I[2] = 90)) : (I[1] = 50, I[0] = t.x - t.x % 100 + 50, I[2] = 0)) : I = oMap.startposition[0] : isNaN(I[0]) && (I = oMap.startposition[(t.initialPlace - 1) % oMap.startposition.length]), t.x = I[0], t.y = I[1], t.rotation = 90 * I[2], t.speed = 0, t.protect = !1, t.figuring = !1, t.figstate = 0, t.fell = !0, stopDrifting(e), supprArme(e), t.using && detruit(t.using[0], t.using[1]), t.champi = 0, ("CI" == page || "MA" == page) && t.cpu && t.aipoints.length) {
                            t.rotinc = 0;
                            var T = !(t.rotincdir = 0);
                            for (r = t.aipoint + 1; r >= t.aipoint - 1; r--) {
                                var w = (r + t.aipoints.length) % t.aipoints.length,
                                    B = t.aipoints[w];
                                if ((ue = B[0] - t.x) * ue + (pe = B[1] - t.y) * pe < 300) {
                                    t.aipoint = w, T = !1;
                                    break
                                }
                            }
                            for (var L = t.aipoint, z = 1; T; z++) {
                                T = !1;
                                for (r = 0; r < 50; r++) {
                                    ai(t), t.rotincdir ? t.rotinc += 2 * t.rotincdir : (t.rotinc < 0 && (t.rotinc = Math.min(0, t.rotinc + 1)), 0 < t.rotinc && (t.rotinc = Math.max(0, t.rotinc - 1))), t.rotinc = Math.min(t.rotinc, fMaxRotInc), t.rotinc = Math.max(t.rotinc, -fMaxRotInc);
                                    var j, D = t.x,
                                        H = t.y,
                                        O = t.speed * direction(0, t.rotation),
                                        R = t.speed * direction(1, t.rotation);
                                    if (t.tourne || !t.speed || t.billball || (t.rotation += t.speedinc < 0 || 0 == t.speedinc && t.speed < 0 ? -t.rotinc : t.rotinc, t.rotation < 0 && (t.rotation += 360), 360 < t.rotation && (t.rotation -= 360), t.x += O, t.y += R), t.z || t.heightinc) t.z += .7 * t.heightinc * Math.abs(t.heightinc), t.heightinc -= .5, t.z <= 0 && (t.heightinc = 0, t.z = 0);
                                    else t.speed < 5 && (t.speed += t.speedinc), (j = sauts(D, H, O, R)) && !t.tourne ? (t.heightinc = j / 30 + 1.5, t.speed = 11) : tombe(Math.round(t.x), Math.round(t.y)) && (T = !0, r = 50)
                                }
                                t.aipoint = L, t.aipoint -= z, T || t.aipoint++, t.aipoint < 0 && (t.aipoint += t.aipoints.length, t.aipoint < 0 && (t.aipoint = L, T = !1)), t.x = I[0], t.y = I[1], t.rotation = 90 * I[2], t.speed = 0, t.rotinc = 0, t.rotincdir = 0
                            }
                        }
                        t.tombe = 20, t.ctrled = !0, t.z = 10;
                        for (r = t.tourne = 0; r < strPlayer.length; r++) t.sprite[r].img.style.display = "none", t.sprite[r].div.style.backgroundImage = "", t.etoile && (t.sprite[r].img.src = getSpriteSrc(t.personnage));
                        for (r = 0; r < strPlayer.length; r++) {
                            if ("BB" == course)
                                for (a = 0; a < t.ballons.length; a++) t.ballons[a][r].img.style.display = "none";
                            t.marker && (t.marker.div[r].style.display = "none")
                        }
                        resetPowerup(t), t.cpu || clLocalVars.falls++, playIfShould(t, "musics/events/fall.mp3")
                    } else if (!t.protect && !t.champi && !t.z && !t.figuring && 1.5 < t.speed && !(12 < t.turbodrift) && (E = ralenti(g, f))) {
                        var A;
                        switch (E) {
                            case "herbe":
                                A = 2.5 - t.speedinc;
                                break;
                            case "glace":
                                A = 3, t.sliding = 8;
                                break;
                            case "eau":
                                A = 3 - t.speedinc, t.sliding = 5;
                                break;
                            case "choco":
                                A = 3 - t.speedinc, t.sliding = 4
                        }
                        t.speed > A && (t.speed = A), stopDrifting(e)
                    }
                    t.figuring = !1, t.figstate = 0
                } if (t.using[0]) {
                var K = t.using[0][t.using[1]];
                K[3] = t.x - 5 * direction(0, t.rotation), K[4] = t.y - 5 * direction(1, t.rotation), K[5] = t.z
            }
            if ("BB" != course) {
                if (checkpoint(t)) {
                    var V = aKarts.length;
                    if (t.demitours = getNextCp(t), t.tours++, t.tours == oMap.tours + 1) {
                        for (r = t.place = 0; r < V; r++) aKarts[r].tours > oMap.tours && t.place++;
                        if (kartIsPlayer(t) && !finishing) {
                            if ("CM" != course && (document.getElementById("infoPlace" + e).innerHTML = toPlace(t.place)), t.using[0]) {
                                var N = bMusic,
                                    F = iSfx;
                                iSfx = bMusic = !1, arme(e), bMusic = N, iSfx = F
                            }
                            if (t.arme = !1, stopDrifting(e), supprArme(e), t.cpu = !0, t.aipoint = 0, t.maxspeed = 5.7, !oPlayers[1 - e] || oPlayers[1 - e].cpu) {
                                if (isOnline) {
                                    var W = document.getElementById("infos0");
                                    W.style.left = 15 * iScreenScale + "px", W.innerHTML = "";
                                    var _ = document.createElement("tr"),
                                        G = document.createElement("td");
                                    G.style.fontSize = 8 * iScreenScale + "px", G.style.color = "#F80", G.innerHTML = toLanguage("&nbsp; &nbsp; FINISH !", "TERMIN&Eacute; !"), _.appendChild(G);
                                    var q = document.createElement("tr"),
                                        J = document.createElement("td");
                                    J.style.fontSize = Math.round(4.5 * iScreenScale + 10) + "px", J.style.color = "#FF0", J.innerHTML = toLanguage("&nbsp; &nbsp; &nbsp; Please wait...", "Veuillez patienter..."), q.appendChild(J), W.appendChild(_), W.appendChild(q), W.style.visibility = "visible", document.getElementById("infoPlace0").style.visibility = "hidden", finishing = !0
                                } else {
                                    if ("CM" != course) {
                                        for (r = 0; r < V; r++) places(r, !0);
                                        var U = aKarts.slice(0);
                                        U.sort(function(e, t) {
                                            return e.place - t.place
                                        });
                                        for (r = 0; r < V; r++) U[r].place = r + 1;
                                        aPlaces = new Array;
                                        for (r = 0; r < V; r++) aPlaces[r] = aKarts[r].place;
                                        var Y = '<tr style="font-size: ' + 2 * iScreenScale + 'px; background-color: white; color: black;"><td>Places</td><td>' + toLanguage("Player", "Joueur") + "</td><td>Pts</td></tr>";
                                        for (r = 0; r < V; r++)
                                            for (a = 0; a < V; a++) {
                                                var Q = aKarts[a].personnage;
                                                if (aKarts[a].place == r + 1) {
                                                    var X = 1 == aKarts[a].team ? 1 : 0,
                                                        Z = [10, 8, 6, 4, 3, 2, 1, 0][Math.round(7 * r / (aKarts.length - 1))];
                                                    Y += '<tr id="fJ' + r + '" style="background-color: ' + (a < strPlayer.length ? a ? X ? "brown" : "navy" : rankingColor(aKarts[a].team) : X ? "red" : "transparent") + '"><td>' + toPlace(r + 1) + ' </td><td class="maj" id="j' + r + '">' + toPerso(Q) + '</td><td id="pts' + r + '">' + aScores[a] + "<small>+" + Z + "</small></td></tr>", aScores[a] += Z, a = V
                                                }
                                            }
                                        Y += '<tr><td colspan="3" id="continuer"></td></tr>', document.getElementById("infos0").style.border = "solid 1px black", document.getElementById("infos0").style.opacity = .7, document.getElementById("infos0").style.fontSize = Math.round(1.77 * iScreenScale - .5) + "pt", document.getElementById("infos0").style.fontFamily = "Courier", document.getElementById("infos0").style.top = 3 * iScreenScale + "px", document.getElementById("infos0").style.left = Math.round(24 * iScreenScale + 10 + (strPlayer.length - 1) / 2 * (iWidth * iScreenScale + 2)) + "px", document.getElementById("infos0").style.backgroundColor = iTeamPlay ? "blue" : "#063", document.getElementById("infos0").style.color = "yellow", document.getElementById("infos0").innerHTML = Y, (oe = document.createElement("input")).type = "button", oe.id = "octn", oe.value = toLanguage("CONTINUE", "CONTINUER"), oe.style.width = "100%", oe.style.height = "100%", oe.style.fontSize = 3 * iScreenScale + "pt", oe.onclick = classement, document.getElementById("continuer").appendChild(oe), document.getElementById("infos0").style.visibility = "visible";
                                        var $ = document.body.scrollTop;
                                        oe.focus(), document.body.scrollTop = $
                                    } else {
                                        document.getElementById("infos0").style.fontSize = 5 * iScreenScale + "px", document.getElementById("infos0").style.fontWeight = "bold", document.getElementById("infos0").style.color = "blue", document.getElementById("infos0").style.top = 10 * iScreenScale + 10 + "px", document.getElementById("infos0").innerHTML = '<tr><td style="text-decoration: blink;">' + document.getElementById("temps0").innerHTML + '</td></tr><tr><td id="continuer"></td></tr>', document.getElementById("infos0").style.visibility = "visible", (oe = document.createElement("input")).type = "button", oe.id = "octn", oe.value = toLanguage("CONTINUE", "CONTINUER"), oe.style.width = "100%", oe.style.height = "100%", oe.style.fontSize = 3 * iScreenScale + "pt", oe.onclick = function() {
                                            document.getElementById("infos0").style.visibility = "hidden";
                                            var t = document.createElement("div");
                                            t.style.color = "black", t.style.position = "absolute", t.style.left = 5 * iScreenScale + 10 + "px", t.style.top = 5 * iScreenScale + 10 + "px", t.style.fontSize = 4 * iScreenScale + "pt", t.style.backgroundColor = "#FF6", t.style.opacity = .8, t.style.border = "double 4px black", t.style.textAlign = "center", t.style.width = 70 * iScreenScale - 10 + "px", t.style.height = 25 * iScreenScale - 10 + "px", t.style.zIndex = 2e4;
                                            var a = document.createElement("p");
                                            a.innerHTML = toLanguage("New record !<br />Save the ghost ?", "Nouveau record !<br />Enregistrer le fant&ocirc;me ?"), a.style.margin = iScreenScale + "px";
                                            var e = a.cloneNode(!1),
                                                n = document.createElement("input");
                                            n.type = "button", n.value = "  " + toLanguage("Yes", "Oui") + "  ", n.style.fontSize = 4 * iScreenScale + "px", n.onmouseover = function() {
                                                this.style.fontSize = 5 * iScreenScale + "px", o.style.fontSize = 4 * iScreenScale + "px"
                                            }, n.onclick = function() {
                                                n.disabled = !0, o.disabled = !0, a.innerHTML = toLanguage("Saving...", "Enregistrement en cours...") + "<br />";
                                                var e = "map=" + oMap.map + "&perso=" + strPlayer[0];
                                                for (r = 0; r < iTrajet.length; r++) e += "&p" + r + "=" + iTrajet[r].toString().replace(/\,/g, "_");
                                                xhr("saveghost_.php", e, function(e) {
                                                    return 1 == e && (gRecord = timer, a.innerHTML = toLanguage("Ghost saved successfully...", "Fantôme enregistré avec succès.") + "<br />", setTimeout(function() {
                                                        n.disabled = !1, i(!(o.disabled = !1))
                                                    }, 500), !0)
                                                })
                                            }, e.appendChild(n);
                                            var o = document.createElement("input");

                                            function i(e) {
                                                a.innerHTML = toLanguage('Save the time to the <a href="classement.php" target="_blank" style="color: orange">record list</a> ?', 'Enregistrer le temps dans la <a href="' + rankingsLink(oMap) + '" target="_blank" style="color: orange">liste des records</a> ?'), n.onclick = function() {
                                                    document.body.removeChild(t), continuer(), document.getElementById("enregistrer").getElementsByTagName("input")[0].onclick()
                                                }, o.onclick = function() {
                                                    document.body.removeChild(t), continuer(), document.getElementById("infos0").style.visibility = "visible"
                                                }, e && (t.style.visibility = "hidden", setTimeout(function() {
                                                    t.style.visibility = "visible"
                                                }, 500))
                                            }
                                            o.type = "button", o.value = "  " + toLanguage("No", "Non") + "  ", o.style.fontSize = 4 * iScreenScale + "px", o.onmouseover = function() {
                                                this.style.fontSize = 5 * iScreenScale + "px", n.style.fontSize = 4 * iScreenScale + "px"
                                            }, o.onclick = function() {
                                                i(!0)
                                            }, e.appendChild(o), t.appendChild(a), t.appendChild(e), document.body.appendChild(t), ("MK" != page || gRecord <= timer) && i(!1)
                                        }, document.getElementById("continuer").appendChild(oe), document.getElementById("infos0").style.visibility = "visible", oe.focus()
                                    }
                                    handleEndRace()
                                }
                                document.onkeydown = void 0, document.onkeyup = void 0, document.onmousedown = void 0, window.onbeforeunload = void 0, window.removeEventListener("blur", window.releaseOnBlur), window.releaseOnBlur = void 0
                            }
                        }
                        oMap.sections && 1 < t.billball && (t.billball = 1)
                    } else if (!(isOnline ? e || finishing : t.cpu) && (document.getElementById("tour" + e).innerHTML = t.tours, document.getElementById("lakitu" + e).getElementsByTagName("div")[0].innerHTML = (oMap.sections ? "Sec" : toLanguage("Lap", "Tour")) + "<small>&nbsp;</small>" + t.tours, t.time = 40, bMusic || iSfx))
                        if (t.tours == oMap.tours) {
                            var ee = !0;
                            for (r = 0; r < oPlayers.length; r++)
                                if (oPlayers[r] != t && 3 <= oPlayers[r].tours) {
                                    ee = !1;
                                    break
                                } if (ee) {
                                var te = postStartMusic("musics/events/lastlap.mp3");
                                iSfx && (fadeOutMusic(carEngine, 1, .6, -1), fadeOutMusic(carEngine2, 1, .6, -1)), te.removeAttribute("loop"), setTimeout(function() {
                                    bMusic && (document.body.contains(te) ? (document.body.removeChild(te), startMapMusic(!0)) : fastenMusic(mapMusic)), iSfx && (carEngine.volume = 1, carEngine2.volume = 1)
                                }, 2700)
                            }
                        } else iSfx && playSoundEffect("musics/events/nextlap.mp3")
                }
            } else if (!isOnline) {
                var ae;
                if (!oPlayers[0].loose || oPlayers[1] && !oPlayers[1].loose)
                    if (iTeamPlay) {
                        var ne = [!1, !1];
                        for (r = 0; r < aKarts.length; r++) aKarts[r].loose || (aKarts[r].cpu || (ae = aKarts[r]), ne[aKarts[r].team] = !0);
                        ne[0] && ne[1] && (ae = void 0)
                    } else {
                        ne = !1;
                        for (r = 0; r < aKarts.length; r++) aKarts[r].loose || (ne ? (ae = void 0, r = aKarts[r].length) : (ne = !0, ae = aKarts[r]))
                    }
                else {
                    for (;
                        (ae = aKarts[Math.floor(Math.random() * (aKarts.length - strPlayer.length)) + strPlayer.length]).loose;);
                    for (r = strPlayer.length; r < aKarts.length; r++) aKarts[r].loose = !0
                }
                if (ae) {
                    for (clLocalVars.gagnant = ae, r = 0; r < strPlayer.length; r++) stopDrifting(r), supprArme(r);
                    for (Y = '<tr style="font-size: ' + 2 * iScreenScale + 'px; background-color: white; color: black;"><td>Places</td><td>' + toLanguage("Player", "Joueur") + "</td><td>Pts</td></tr>", r = 0; r < aKarts.length; r++) {
                        X = 1 == aKarts[r].team ? 1 : 0, Z = aKarts[r] == ae, Q = aKarts[r].personnage;
                        Y += '<tr id="fJ' + r + '" style="background-color:' + (r < strPlayer.length ? r ? X ? "brown" : "navy" : rankingColor(aKarts[r].team) : X ? "red" : "transparent") + '"><td>' + toPlace(r + 1) + ' </td><td class="maj" id="j' + r + '">' + toPerso(Q) + '</td><td id="pts' + r + '">' + aScores[r] + (Z ? "<small>+1</small>" : "") + "</td></tr>", aScores[r] += Z
                    }
                    var oe;
                    Y += '<tr><td colspan="3" id="continuer"></td></tr>', document.getElementById("infos0").style.border = "solid 1px black", document.getElementById("infos0").style.opacity = .7, document.getElementById("infos0").style.fontSize = Math.round(1.77 * iScreenScale - .5) + "pt", document.getElementById("infos0").style.fontFamily = "Courier", document.getElementById("infos0").style.top = 3 * iScreenScale + "px", document.getElementById("infos0").style.left = Math.round(24 * iScreenScale + 10 + (strPlayer.length - 1) / 2 * (iWidth * iScreenScale + 2)) + "px", document.getElementById("infos0").style.backgroundColor = iTeamPlay ? "blue" : "#063", document.getElementById("infos0").style.color = "yellow", document.getElementById("infos0").innerHTML = Y, (oe = document.createElement("input")).type = "button", oe.id = "octn", oe.value = toLanguage("CONTINUE", "CONTINUER"), oe.style.width = "100%", oe.style.height = "100%", oe.style.fontSize = 3 * iScreenScale + "pt", oe.onclick = classement, document.getElementById("continuer").appendChild(oe), document.getElementById("infos0").style.visibility = "visible";
                    $ = document.body.scrollTop;
                    for (oe.focus(), document.body.scrollTop = $, r = 0; r < aKarts.length; r++) aKarts[r].loose = !0;
                    handleEndRace(), document.onkeydown = void 0, document.onkeyup = void 0, document.onmousedown = void 0, window.onbeforeunload = void 0, window.removeEventListener("blur", window.releaseOnBlur), window.releaseOnBlur = void 0
                }
            }
            if (t.cpu) {
                if (25 == t.roulette || t.using[0] && !t.tourne)
                    if (oMap.lignedroite && ("champi" == t.arme || "megachampi" == t.arme || "etoile" == t.arme) || "BB" == course && !iTeamPlay && "carapacerouge" == t.using[2])
                        if ("carapacerouge" != t.using[2])
                            for (a = 0; a < oMap.lignedroite.length; a++) {
                                var ie = oMap.lignedroite[a];
                                t.x > ie[0] && t.x < ie[0] + 50 && t.y > ie[1] && t.y < ie[1] + 50 && (arme(e), a = oMap.lignedroite.length)
                            } else
                                for (r = 0; r < strPlayer.length; r++) !aKarts[r].loose && Math.pow(aKarts[r].x - t.x - 15 * direction(0, t.rotation), 2) + Math.pow(aKarts[r].y - t.y - 15 * direction(1, t.rotation), 2) < 1e3 && (arme(e), r = strPlayer.length);
                        else if (.98 < Math.random()) arme(e, (t.place < oPlayers[0].place || "BB" == course) && .5 < Math.random());
                if ("BB" == course) t.maxspeed = 5.7;
                else {
                    var re = 1,
                        le = iDificulty;
                    complete && (le *= (re = Math.max(Math.pow(.96, e - oPlayers.length - 2), .8)) * iDificulty / 5);
                    var se = 1.25;
                    5 <= iDificulty && 8 < aKarts.length && (se *= Math.log(1 + 100 * aKarts.length / 8) / 4.61), t.maxspeed > le * se ? t.maxspeed = le * se : t.maxspeed < le && (t.maxspeed = le), t.place <= oPlayers[0].place ? t.maxspeed -= (t.maxspeed * re - le * t.size) / 100 : t.maxspeed += (le * se * 1.12 * t.size - t.maxspeed * re) / 100
                }
            } else t.maxspeed = 5.4 * cp[t.personnage][1];
            if (t.turbodrift && (-8 < t.speed && (t.maxspeed = 8, t.speed = Math.max(8, t.speed)), t.turbodrift--), t.champi && (t.maxspeed = 11, t.champi--, "BB" == course)) {
                for (r = 0; r < aKarts.length; r++) {
                    var ce = aKarts[r];
                    !(!friendlyFire(t, ce) && t.ballons.length && ce.ballons.length && Math.pow(t.x - ce.x, 2) + Math.pow(t.y - ce.y, 2) < 25 && Math.abs(t.z - ce.z) < 2) || t.tourne || ce.tourne || ce.protect || ce.champi || (handleHit2(t, ce), loseBall(r), stopDrifting(r), t.ballons.length < 3 && addNewBalloon(t, ce.team), ce.spin(20))
                }
            }
            if (t.billball) {
                var ue, pe;
                if (t.z = 2, t.heightinc = 0, t.speed = 9, null != t.aipoint)(ue = t.aipoints[t.aipoint][0] - t.x) * ue + (pe = t.aipoints[t.aipoint][1] - t.y) * pe < 1600 && (t.aipoint++, t.aipoint >= t.aipoints.length && (t.aipoint = 0));
                else {
                    var de = t.demitours + 1;
                    de >= oMap.checkpoint.length && (de = 0), ue = (ie = oMap.checkpoint[de])[0] + (ie[3] ? Math.round(ie[2] / 2) : 8) - t.x, pe = ie[1] + (ie[3] ? 8 : Math.round(ie[2] / 2)) - t.y;
                    for (r = 0; r < t.aipoints.length; r++) {
                        ie = t.aipoints[r];
                        if (t.x > ie[0] - 35 && t.x < ie[0] + 35 && t.y > ie[1] - 35 && t.y < ie[1] + 35) {
                            var me = r + 1;
                            me == t.aipoints.length && (me = 0);
                            var ye = t.aipoints[me][0],
                                he = t.aipoints[me][1],
                                ge = t.rotation * Math.PI / 180,
                                fe = Math.abs(normalizeAngle(Math.atan2(ye - t.x, he - t.y) - ge, 2 * Math.PI)),
                                Se = Math.abs(normalizeAngle(Math.atan2(ue, pe) - ge, 2 * Math.PI));
                            if (fe < Math.max(Se, Math.PI / 4)) {
                                t.aipoint = me, ue = ye - t.x, pe = he - t.y;
                                break
                            }
                        }
                    }
                }
                var be = ue * direction(1, t.rotation) - pe * direction(0, t.rotation),
                    ve = ue * direction(0, t.rotation) + pe * direction(1, t.rotation),
                    Ce = Math.atan2(be, ve) / Math.PI * 180;
                if (10 < Math.abs(Ce) && (Ce = 60 < Math.abs(Ce) ? (t.speed = 1, 0 < Ce ? 20 : -20) : 0 < Ce ? 10 : -10), t.rotation += Ce, t.rotation = t.rotation % 360, t.billball--, t.billball) {
                    if (!t.billjump && t.billball < 12) {
                        u = t.speed * direction(0, t.rotation), p = t.speed * direction(1, t.rotation);
                        sauts(t.x, t.y, u, p) && (t.billball = 12, t.billjump = !0)
                    }
                } else {
                    for (r = 0; r < strPlayer.length; r++) t.sprite[r].img.src = getSpriteSrc(t.personnage);
                    t.size = 1, t.z = 0, updateDriftSize(e), t.jumped = !1, t.protect = !1, delete t.billjump, t.cpu || delete t.aipoint
                }
            }
            if (t.etoile && (t.maxspeed *= 1.35, t.etoile--, t.etoile < 15)) {
                for (r = 0; r < strPlayer.length; r++) t.sprite[r].img.src = t.etoile % 2 ? getStarSrc(t.personnage) : getSpriteSrc(t.personnage);
                if (!t.etoile) {
                    t.protect = !!t.megachampi;
                    var Me = t.cpu ? 1 : cp[t.personnage][0] * t.size;
                    t.speedinc = Math.min(t.speedinc, Me), stopStarMusic(t)
                }
            }
            if (t.megachampi && (t.megachampi--, 41 < t.megachampi ? t.size *= 1.05 : t.megachampi < 8 && (t.size /= 1.05, t.megachampi || (t.protect = !!t.etoile, stopMegaMusic(t))), updateDriftSize(e)), t.eclair && (t.eclair--, (isOnline || 80 < t.eclair) && t.eclair <= 88 && (document.getElementById("mariokartcontainer").style.opacity = 1), t.eclair < 1))
                for (r = 0; r < aKarts.length; r++) {
                    friendlyFire(ce = aKarts[r], t) || !(ce.size < 1) || isOnline && ce != oPlayers[0] || (ce.size = 1, updateDriftSize(r))
                }
            if (!t.z && accelere(g, f) && (t.champi = 20, t.maxspeed = 11, t.speed = 11, t.boostSound || (t.boostSound = playIfShould(t, "musics/events/boost.mp3"), t.boostSound && (t.boostSound.onended = function() {
                    t.boostSound = void 0, document.body.removeChild(this)
                }))), !iSfx || t != oPlayers[0] || finishing || t.cpu || t.loose && !isOnline || (bMusic && (t.etoile || t.megachampi) || t.tombe || t.turbodrift || t.turboSound ? (updateEngineSound(), 14 == t.turbodrift && (carEngine3.currentTime = 0, carEngine3.volume = 1, carEngine3.play(), t.turboSound = carEngine3, clearTimeout(t.turboHandler), t.turboHandler = setTimeout(function() {
                    t.turboSound && (t.turboSound.pause(), t.turboSound = void 0)
                }, 2e3), t.sparkSound && (fadeOutMusic(t.sparkSound, 1, .8, !1), t.sparkSound = void 0)), bMusic && t.protect && t.turboSound && (t.turboSound.volume = 0)) : updateEngineSound(3 < t.speed ? carEngine2 : carEngine)), "BB" == course && !t.ballons.length && !t.tourne && !t.loose) {
                var xe = t.sprite[0].div.style.opacity - .1;
                for (r = 0; r < strPlayer.length; r++) t.sprite[r].div.style.opacity = xe;
                if (xe < (isOnline && t == oPlayers[0] ? .4 : .01)) {
                    if (!isOnline || t != oPlayers[0])
                        for (r = 0; r < strPlayer.length; r++) t.sprite[r].img.style.display = "none", t.marker && (t.marker.div[r].style.display = "none");
                    t.loose = !0, challengeCheck("each_kill")
                }
            }
        }
    }

    function kartIsPlayer(e) {
        return isOnline ? e == oPlayers[0] : !e.cpu
    }

    function angleDrift(e) {
        return kartIsPlayer(e) ? e.sliding ? e.rotinc * e.sliding : 6 * e.drift : 0
    }

    function angleShoot(e, t) {
        var a = e.rotation;
        return t && (a += 180), a
    }

    function updateDriftSize(e) {
        if (kartIsPlayer(aKarts[e])) {
            var t = aKarts[e].size - 1;
            getDriftImg(e).style.left = -Math.round(2 * iScreenScale * t) + "px", getDriftImg(e).style.top = Math.round(2 * iScreenScale * t) + "px", getDriftImg(e).style.width = Math.round(8 * iScreenScale + 4 * iScreenScale * t) + "px"
        }
    }

    function getDriftImg(e) {
        return document.getElementById("drift" + e).getElementsByClassName("driftimg")[0]
    }

    function openCheats() {
        var e = prompt("MKPC Console command");
        if (!e) return !1;
        processCode(e) || alert("Invalid command"), clLocalVars.cheated = !0
    }

    function processCode(e) {
        if ("/" != e.charAt(0)) return !1;
        e = e.substring(1);
        var t = oPlayers[0],
            a = /^give (\w+)$/g.exec(e);
        if (a) {
            var n = a[1];
            return -1 != objets.indexOf(n) && (t.arme = n, t.roulette = 25, document.getElementById("scroller0").style.visibility = "hidden", document.getElementById("roulette0").innerHTML = '<img alt="." class="pixelated" src="images/items/' + n + '.gif" style="width: ' + Math.round(8 * iScreenScale - 3) + 'px;" />', !0)
        }
        var o = /^tp ([\d\-+\.]+) ([\d\-+\.]+)$/g.exec(e);
        if (o = o || /^tp ([\d\-+\.]+) ([\d\-+\.]+) ([\d\-+\.]+)$/g.exec(e)) {
            var r = parseFloat(o[1]),
                l = parseFloat(o[2]);
            if (isNaN(r) || isNaN(l)) return !1;
            var s = parseFloat(o[3]);
            return t.x = r, t.y = l, isNaN(s) || (t.rotation = s), !0
        }
        var c = /^lap(?: ([1-3]|c))?(?: (\d+|c))?$/g.exec(e);
        if (c) {
            var u = parseInt(c[1]),
                p = parseInt(c[2]);
            return "c" == c[1] && (u = t.tours), c[1] || (u = oMap.tours, p = oMap.checkpoint.length - 1), "c" == c[2] && (p = t.demitours), c[2] || (p = oMap.checkpoint.length - 1), isNaN(u) || isNaN(p) ? !1 : (t.tours = u, t.demitours = p, document.getElementById("tour0").innerHTML = t.tours, !0)
        }
        if ("BB" == course) {
            "balloon" == e && (e += " 1");
            var d = /^balloon (\d+)$/g.exec(e);
            if (d) {
                var m = parseInt(d[1]);
                if (m) {
                    for (t.reserve += m, document.getElementById("compteur0").innerHTML = "&nbsp;", i = 0; i < t.reserve; i++) document.getElementById("compteur0").innerHTML += '<img src="' + balloonSrc(t.team) + '" style="width: ' + 2 * iScreenScale + '" />';
                    return !0
                }
            }
        }
        return !1
    }

    function ai(e) {
        var t = isBattle && complete,
            a = !isBattle && complete,
            n = !isBattle && simplified,
            o = isBattle && simplified,
            i = "BB" == course && !isCup,
            r = t || i,
            l = complete || i;
        if (oMap.sections && e.tours > oMap.tours || e.ballons && !e.ballons.length) return e.speedinc = 0, void(e.rotincdir = 0);
        if (e.aipoints.length) {
            if (r) {
                if (null == e.aipoint)
                    for (var s = 1 / 0, c = 0; c < e.aipoints.length; c++) {
                        if (c != e.lastAI)
                            if (0 == (E = e.aipoints[c])[0]) {
                                var u = E[1] - e.x,
                                    p = E[2] - e.y,
                                    d = Math.sqrt(u * u + p * p),
                                    m = 2 * d + d * Math.abs((Math.atan2(u, p) - e.rotation * Math.PI / 180 + Math.PI) % (2 * Math.PI) - Math.PI);
                                m < s && (e.aipoint = c, s = m)
                            }
                    }
                if (null == e.aipoint) return
            }
            var y = e.aipoints[e.aipoint];
            o && (y = [e.aipoint % 6 * 100 + 50, 100 * Math.floor(e.aipoint / 6) + 50]);
            var h = y[0] - e.x,
                g = y[1] - e.y;
            r && (h = y[1] - e.x, g = y[2] - e.y), iRotatedX = h * direction(1, e.rotation) - g * direction(0, e.rotation), iRotatedY = h * direction(0, e.rotation) + g * direction(1, e.rotation);
            var f = h * h + g * g,
                S = Math.atan2(iRotatedX, iRotatedY) / Math.PI * 180;
            if (e.speedinc = 0 <= e.speed ? 1 : .2, isBattle)
                if (r || 27 == oMap.skin) {
                    if (e.speed < 0 && (e.retablissement || (e.reflexion ? (e.reflexion--, 0 == e.reflexion && (e.decision = -e.decision)) : e.decision = -1, e.reflexion || (e.reflexion = 5)), e.rotincdir = e.decision, e.retablissement = 7), e.retablissement) e.retablissement--;
                    else if (Math.abs(S) > 7 + 5 * Math.random()) {
                        x = !0;
                        S < -(P = 10) ? e.rotation -= P : P < S ? e.rotation += P : (e.rotation += S, x = !1), x && (e.speed = 10 * P / Math.abs(S), e.speedinc = 0)
                    }
                } else if (Math.abs(S) > 7 + 5 * Math.random() || e.speed < 0) {
                if ("BB" == course && oMap.trous) {
                    10 < Math.abs(S) && 4 < e.speed && (e.speedinc = 0);
                    P = 89.9;
                    Math.abs(S) > P ? (e.speed = Math.min(e.speed, 4 * Math.pow(P / Math.abs(S), 4)), e.movesince = 10) : 0 < e.movesince && (e.movesince--, e.speed = Math.min(e.speed, 1.5))
                }
                if (n && 24 == oMap.skin && 0 < e.speed) {
                    P = 25 + 10 * Math.random();
                    Math.abs(S) > P && (e.speed = Math.min(e.speed, 5 * Math.sqrt(P / Math.abs(S))))
                }
                e.rotincdir = 0 < S && 0 < e.speed ? 1 : -1
            } else e.rotincdir = 0;
            else {
                if (e.speed < 0) {
                    if (e.movesince = 12, e.retablit) {
                        if (e.retablit = !1, e.movesince && (e.movesince--, e.movesince < (complete ? 6 : 1) && (e.reflexion = 0)), e.reflexion) e.reflexion--, 0 == e.reflexion && (e.decision = -e.decision);
                        else if (e.horizontality) {
                            var b = direction(0, e.rotation),
                                v = direction(1, e.rotation),
                                C = e.horizontality[0],
                                M = e.horizontality[1];
                            e.decision = 0 < b * C + v * M != 0 < b * M - v * C ? 1 : -1
                        } else e.decision = -1;
                        e.reflexion || (e.reflexion = 5)
                    }
                    e.rotincdir = e.decision
                } else if (e.retablit = !0, e.movesince && (e.movesince--, e.movesince || (e.reflexion = 0)), Math.abs(S) > 7 + 5 * Math.random())
                    if (l) {
                        var x = !0;
                        S < -(P = 10) ? e.rotation -= P : P < S ? e.rotation += P : (e.rotation += S, x = !1), x && (e.movesince || (e.protect || e.champi || e.z || !ralenti(Math.round(e.x), Math.round(e.y))) && (e.speed = 60 * Math.pow(P / Math.abs(S), 2.5), e.speedinc = 0))
                    } else {
                        if (10 < Math.abs(S) && 5 < e.speed && (e.speedinc = 0), 24 == oMap.skin) {
                            var P = 25 + 10 * Math.random();
                            Math.abs(S) > P && (e.speed = Math.min(e.speed, 5 * Math.sqrt(P / Math.abs(S))))
                        }
                        e.rotincdir = 0 < S ? 1 : -1
                    }
                else l || (e.rotincdir = 0);
                a && 4e4 < f && S < 7 && ("champi" == e.arme || "megachampi" == e.arme || "etoile" == e.arme) && arme(aKarts.indexOf(e))
            }
            if (oMap.jumpable && 4 < iDificulty && (!e.z || e.jumped || e.billball || e.figstate || e.figuring || e.tourne || !(0 < e.heightinc) || 5e3 < f && Math.abs(S) < 13 && (e.figstate = 21)), r) {
                if (f < 300) {
                    var k = new Array;
                    for (c = 0; c < e.aipoints.length; c++) {
                        var E;
                        1 == (E = e.aipoints[c])[0] && (E[1] == e.aipoint ? k.push(E[2]) : E[2] == e.aipoint && k.push(E[1]))
                    }
                    var I = e.lastAI;
                    if (e.lastAI = e.aipoint, k.length)
                        for (; e.aipoint = k[Math.floor(Math.random() * k.length)], I == e.aipoint && 1 < k.length;);
                    else e.aipoint = void 0
                }
            } else if (o) {
                var T = Math.floor(e.x / 100) + 6 * Math.floor(e.y / 100);
                if (T != e.lastAI && (27 != oMap.skin || f < 300 || e.speed < 0 || e.tombe)) {
                    k = e.aipoints[T], I = e.lastAI;
                    for (e.lastAI = T; e.aipoint = k[Math.floor(Math.random() * k.length)], I == e.aipoint && 1 < k.length;);
                }
            } else f < (a ? 300 : 1600) && (e.aipoint++, e.aipoint >= e.aipoints.length && (e.aipoint = 0))
        }
    }

    function cycle() {
        pause || (setTimeout(cycle, 67), runOneFrame())
    }

    function runOneFrame() {
        for (var e = 0; e < aKarts.length; e++) {
            var t = aKarts[e];
            if (e && "CM" == course && !t.cpu) {
                var a = jTrajets[e - 1];
                if (timer <= a.length) {
                    var n = a[timer - 1];
                    t.tombe && (t.tombe--, t.tombe || (t.sprite[0].img.style.display = "block")), t.x = n[0], t.y = n[1], t.rotation = n[2], n[3] && (t.z = n[3], n[4] && (t.tombe = 20, t.sprite[0].img.style.display = "none"));
                    continue
                }
                t.cpu = !0, t.aipoint = 0, t.arme = !1
            }
            if ((!t.loose || isOnline) && (t.cpu && (t.billball || ai(t), pCol(t)), move(e), t.protect && colKart(t), "CM" == course && !t.cpu)) {
                var o = [t.x, t.y, t.rotation];
                t.z && (o.push(t.z), 20 == t.tombe && o.push(!0)), iTrajet.push(o)
            }
        }
        if ("CM" != course)
            for (e = 0; e < aKarts.length; e++) places(e);
        oMap.infoPlus && oMap.infoPlus({
            map: oMap,
            players: oPlayers,
            karts: aKarts
        }), oPlayers[0].cpu || challengeCheck("each_frame"), refreshDatas && resetDatas(), render()
    }
    Math.hypot || (Math.hypot = function(e, t) {
        return Math.sqrt(e * e + t * t)
    });
    var gameControls = {};
    document.onkeydown = function(e) {
        var t = gameControls[e.keyCode];
        switch (t) {
            case "up":
                return (oPlayers[0].speedinc = 1) < document.getElementById("decompte0").innerHTML && updateEngineSound(carEngine2), !1;
            case "left":
                return !(oPlayers[0].rotincdir = 1);
            case "right":
                return !(oPlayers[0].rotincdir = -1)
        }
        if (oPlayers[1]) switch (t) {
            case "up_p2":
                oPlayers[1].speedinc = 1;
                break;
            case "left_p2":
                oPlayers[1].rotincdir = 1;
                break;
            case "right_p2":
                oPlayers[1].rotincdir = -1
        }
    }, document.onkeyup = function(e) {
        var t = gameControls[e.keyCode];
        switch (t) {
            case "up":
                oPlayers[0].speedinc = 0, updateEngineSound(carEngine);
                break;
            case "left":
            case "right":
                oPlayers[0].rotincdir = 0
        }
        if (oPlayers[1]) switch (t) {
            case "up_p2":
                oPlayers[1].speedinc = 0;
                break;
            case "left_p2":
                oPlayers[1].rotincdir = 0;
                break;
            case "right_p2":
                oPlayers[1].rotincdir = 0
        }
    };
    var virtualButtonW = 60,
        virtualButtonH = 50,
        myPersosCache, startMusicHandler;

    function addButton(e, t, a, n, o, i, r) {
        o = (o || 1) * virtualButtonW, i = (i || 1) * virtualButtonH;
        var l = document.createElement("button");
        return l.style.position = "absolute", l.style.left = Math.round(a * virtualButtonW * 1.2) + "px", l.style.top = Math.round(n * virtualButtonH * 1.3) + "px", l.style.width = o + "px", l.style.height = i + "px", l.style.textAlign = "center", l.style.padding = "0px", r && (l.style.fontSize = r + "px"), l.innerHTML = e, l.dataset.key = t, l.ontouchstart = onButtonTouch, l.ontouchend = onButtonPress, document.getElementById("virtualkeyboard").appendChild(l), l
    }

    function isCustomPerso(a) {
        if (a.startsWith("cp-")) {
            if (!customPersos[a]) {
                cp[a] = [.6, 1, .6];
                var e = PERSOS_DIR + a + "-ld.png";
                customPersos[a] = {
                    name: language ? "Deleted character" : "Perso supprimé",
                    map: e,
                    podium: e,
                    music: "mario"
                }, xhr("getCP.php", "perso=" + a, function(e) {
                    if (-1 == e) return !0;
                    if (!e) return !1;
                    var t;
                    try {
                        t = JSON.parse(e)
                    } catch (e) {
                        return !1
                    }
                    return cp[a][0] = 0.2 + 0.8 * t.acceleration, cp[a][1] = 0.8 + 0.4 * t.speed, cp[a][2] = 0.2 + 0.8 * t.handling, customPersos[a] = t, !0
                })
            }
            return !0
        }
        return !1
    }

    function getWinnerSrc(e) {
        return isCustomPerso(e) ? customPersos[e].podium : "images/winners/w_" + e + ".png"
    }

    function getEndingSrc(e) {
        return isCustomPerso(e) && (e = customPersos[e].music), baseCp[e] ? "musics/endings/ending_" + e + ".mp3" : e
    }

    function getStarSrc(e) {
        return isCustomPerso(e) ? PERSOS_DIR + e + "-star.png" : "images/star/star_" + e + ".png"
    }

    function getSpriteSrc(e) {
        return isCustomPerso(e) ? PERSOS_DIR + e + ".png" : "images/sprites/sprite_" + e + ".png"
    }

    function getMapIcSrc(e) {
        return isCustomPerso(e) ? customPersos[e].map : "images/map_icons/" + e + ".png"
    }

    function getMapSelectorSrc(e) {
        return isCup ? complete ? "trackicon.php?id=" + oMaps[aAvailableMaps[e]].map + "&type=" + ("BB" == course ? 2 : 1) : "trackicon.php?id=" + oMaps[aAvailableMaps[e]].id + "&type=0" : "images/selectors/select_" + aAvailableMaps[e] + ".png"
    }

    function getMapId(e) {
        var t = isBattle ? nid : simplified ? e.id : e.map;
        return void 0 === t && (t = -1), t
    }

    function privateGame(t) {
        var e = document.createElement("div"),
            a = e.style;
        a.width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black", e.appendChild(toTitle(toLanguage("Private game", "Partie privée"), 0));
        var n, o = document.createElement("div");
        o.style.position = "absolute", o.style.left = 6 * iScreenScale + "px", o.style.top = 12 * iScreenScale + "px", o.style.fontSize = Math.round(2.5 * iScreenScale) + "px", o.style.color = "#DFC", o.innerHTML = language ? "The &quot;private game&quot; option allows you to play only with people you want.<br />The principle is simple: a private link is generated, you send this link to the concerned members, and you can start playing." : "L'option &quot;partie privée&quot; vous permet de jouer uniquement avec les personnes de votre choix.<br />Le principe est simple : un lien privé est généré, vous envoyez ce lien aux membres concernés, et vous pouvez commencer à jouer.", e.appendChild(o), (n = document.createElement("input")).type = "button", n.value = toLanguage("Generate private link", "Générer un lien privé"), n.style.fontSize = 3 * iScreenScale + "px", n.style.position = "absolute", n.style.width = 35 * iScreenScale + "px", n.style.left = 23 * iScreenScale + "px", n.style.top = 28 * iScreenScale + "px", n.onclick = function() {
            e.innerHTML = "", oContainers[0].removeChild(e), privateLink(t)
        }, e.appendChild(n), (n = document.createElement("input")).type = "button", n.value = toLanguage("Back", "Retour"), n.style.fontSize = 2 * iScreenScale + "px", n.style.position = "absolute", n.style.left = 2 * iScreenScale + "px", n.style.top = 35 * iScreenScale + "px", n.onclick = function() {
            e.innerHTML = "", oContainers[0].removeChild(e), shareLink.options = null, selectPlayerScreen(0)
        }, e.appendChild(n), (n = document.createElement("input")).type = "button", n.value = toLanguage("Private game options...", "Options de la partie privée..."), n.style.fontSize = 2 * iScreenScale + "px", n.style.position = "absolute", n.style.left = 52 * iScreenScale + "px", n.style.top = 35 * iScreenScale + "px", n.onclick = function() {
            e.innerHTML = "", oContainers[0].removeChild(e), privateGameOptions(shareLink.options, function(e) {
                e && (shareLink.options = e, t = e), privateGame(t)
            })
        }, e.appendChild(n), oContainers[0].appendChild(e)
    }

    function privateGameOptions(e, o) {
        var t, i = document.createElement("div"),
            a = i.style;
        a.width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black", (t = toTitle(isOnline ? toLanguage("Private game options", "Options partie privée") : toLanguage("Online game options", "Options mode en ligne"), 0)).style.fontSize = 7 * iScreenScale + "px", i.appendChild(t);
        var n = document.createElement("form");
        n.style.position = "absolute", n.style.left = "0px", n.style.top = 8 * iScreenScale + "px", n.style.width = iWidth * iScreenScale + "px", n.onsubmit = function(e) {
            e.preventDefault();
            var t = this.elements["option-teams"].checked ? 1 : 0,
                a = this.elements["option-manualTeams"].checked ? 1 : 0;
            t || (a = 0);
            var n = this.elements["option-friendly"].checked ? 1 : 0;
            o({
                team: t,
                manualTeams: a,
                friendly: n
            }), i.innerHTML = "", oContainers[0].removeChild(i)
        };
        var r = document.createElement("div");
        r.style.height = 20 * iScreenScale + "px", r.style.overflow = "auto";
        var l = document.createElement("table");
        l.style.marginLeft = "auto", l.style.marginRight = "auto";
        var s = document.createElement("tr");
        (c = document.createElement("td")).style.textAlign = "center", c.style.width = 8 * iScreenScale + "px", (u = document.createElement("input")).style.transform = u.style.WebkitTransform = u.style.MozTransform = "scale(" + Math.round(iScreenScale / 3) + ")", u.id = "option-teams", u.name = "option-teams", u.type = "checkbox", e && e.team && (u.checked = !0), u.onchange = function() {
            this.checked ? document.getElementById("option-manualTeams-ctn").style.display = "" : document.getElementById("option-manualTeams-ctn").style.display = "none"
        }, c.appendChild(u), s.appendChild(c);
        var c = document.createElement("td");
        (p = document.createElement("label")).style.cursor = "pointer", p.setAttribute("for", "option-teams"), (d = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", d.style.marginBottom = "0px", d.innerHTML = toLanguage("Team games", "Parties par équipe"), p.appendChild(d), (m = document.createElement("div")).style.fontSize = 2 * iScreenScale + "px", m.style.color = "white", m.innerHTML = toLanguage("If enabled, 2 teams are selected in each game. You object: defeat the opposing team.", "Si activé, 2 équipes sont sélectionnées à chaque partie. Votre objectif : vaincre l'équipe adverse."), p.appendChild(m), c.appendChild(p), c.style.padding = Math.round(1.5 * iScreenScale) + "px 0", s.appendChild(c), l.appendChild(s), (s = document.createElement("tr")).id = "option-manualTeams-ctn", e && e.team || (s.style.display = "none"), (c = document.createElement("td")).style.textAlign = "center", c.style.width = 8 * iScreenScale + "px", (u = document.createElement("input")).style.position = "relative", u.style.left = Math.round(1.5 * iScreenScale) + "px", u.style.transform = u.style.WebkitTransform = u.style.MozTransform = "scale(" + Math.round(iScreenScale / 3) + ")", u.id = "option-manualTeams", u.name = "option-manualTeams", u.type = "checkbox", e && e.team && e.manualTeams && (u.checked = !0), c.appendChild(u), s.appendChild(c);
        c = document.createElement("td");
        (p = document.createElement("label")).style.cursor = "pointer", p.style.display = "inline-block", p.setAttribute("for", "option-manualTeams"), (d = document.createElement("h1")).style.marginTop = 0, d.style.marginLeft = Math.round(1.5 * iScreenScale) + "px", d.style.fontSize = 3 * iScreenScale + "px", d.style.marginBottom = "0px", d.innerHTML = toLanguage("Manual selection", "Sélection manuelle"), p.appendChild(d), (m = document.createElement("div")).style.paddingLeft = Math.round(1.5 * iScreenScale) + "px", m.style.fontSize = 2 * iScreenScale + "px", m.style.color = "white", m.innerHTML = toLanguage("If enabled, teams are selected manually at each game.", "Si activé, les équipes sont sélectionnées manuellement à chaque partie. Sinon, les équipes sont formées automatiquement en fonction du niveau de chaque joueur."), p.appendChild(m), c.appendChild(p), c.style.paddingBottom = Math.round(1.5 * iScreenScale) + "px", s.appendChild(c), l.appendChild(s);
        var u;
        s = document.createElement("tr");
        (c = document.createElement("td")).style.textAlign = "center", c.style.width = 8 * iScreenScale + "px", (u = document.createElement("input")).id = "option-friendly", u.name = "option-friendly", u.type = "checkbox", e && e.friendly && (u.checked = !0), u.style.transform = u.style.WebkitTransform = u.style.MozTransform = "scale(" + Math.round(iScreenScale / 3) + ")", c.appendChild(u), s.appendChild(c);
        var p, d, m;
        c = document.createElement("td");
        (p = document.createElement("label")).style.cursor = "pointer", p.setAttribute("for", "option-friendly"), c.appendChild(p), (d = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", d.innerHTML = toLanguage("Friendly game", "Matchs amicaux"), d.style.marginBottom = "0px", p.appendChild(d), (m = document.createElement("div")).style.fontSize = 2 * iScreenScale + "px", m.style.color = "white", m.innerHTML = toLanguage("If enabled, games won't make you win or lose points in the online mode.", "Si activé, les parties ne vous feront pas gagner ou perdre de points dans le mode en ligne."), p.appendChild(m), c.appendChild(p), s.appendChild(c), l.appendChild(s), r.appendChild(l), n.appendChild(r), (m = document.createElement("div")).style.textAlign = "center", m.style.marginTop = 2 * iScreenScale + "px";
        var y = document.createElement("input");
        y.type = "submit", y.value = toLanguage("Validate", "Valider"), y.style.fontSize = 3 * iScreenScale + "px", y.style.width = 18 * iScreenScale + "px", m.appendChild(y), n.appendChild(m), i.appendChild(n);
        var h = document.createElement("input");
        h.type = "button", h.value = toLanguage("Cancel", "Annuler"), h.style.fontSize = 2 * iScreenScale + "px", h.style.position = "absolute", h.style.left = 2 * iScreenScale + "px", h.style.top = 35 * iScreenScale + "px", h.onclick = function() {
            i.innerHTML = "", oContainers[0].removeChild(i), o(null)
        }, i.appendChild(h), oContainers[0].appendChild(i)
    }

    function privateLink(e) {
        var i = document.createElement("div"),
            t = i.style;
        t.width = iWidth * iScreenScale + "px", t.height = iHeight * iScreenScale + "px", t.border = "solid 1px black", t.backgroundColor = "black", i.appendChild(toTitle(toLanguage("Private game", "Partie privée"), 0)), xhr("privateGame.php", isCustomOptions(e) ? "options=" + encodeURIComponent(JSON.stringify(e)) : null, function(e) {
            if (e) {
                var t = shareLink.url,
                    a = shareLink.params.slice(0);
                a.push("key=" + e);
                var n = t + "?" + a.join("&"),
                    o = document.createElement("div");
                return o.style.position = "absolute", o.style.left = "0px", o.style.top = 13 * iScreenScale + "px", o.style.width = iWidth * iScreenScale + "px", o.style.textAlign = "center", o.style.fontSize = 3 * iScreenScale + "px", o.style.color = "#CFC", o.innerHTML = language ? 'The following private link has been generated:<br /><a href="' + n + '" style="color:AAF">' + n + "</a><br /><br />Enjoy game :)" : 'Le lien privé suivant a été généré :<br /><a href="' + n + '" style="color:AAF">' + n + "</a><br /><br />Bonne partie :)", i.appendChild(o), !0
            }
            return !1
        }), oContainers[0].appendChild(i)
    }

    function selectTypeScreen() {
        var e, t = document.createElement("div");
        (a = t.style).width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black";
        var a, n = new Image;
        if (n.src = "images/mariokart.gif", n.style.position = "absolute", n.style.width = 39 * iScreenScale + "px", n.style.height = 10 * iScreenScale + "px", n.style.left = (iWidth - 39) / 2 * iScreenScale + "px", n.style.top = iScreenScale + "px", t.appendChild(n), (a = t.style).width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black", oContainers[0].appendChild(t), "MK" == page) {
            (s = document.createElement("input")).type = "button", s.value = "Grand Prix", s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 10 * iScreenScale + "px", s.style.top = 14 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                course = "GP", e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectPlayerScreen(0)
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("Time trial", "Contre-la-montre"), s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 40 * iScreenScale + "px", s.style.top = 14 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                course = "CM", e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectPlayerScreen(0)
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("VS", "Course VS"), s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = "0px", s.style.top = 21 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                course = "VS", e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectNbJoueurs()
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("Battle", "Bataille"), s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 50 * iScreenScale + "px", s.style.top = 21 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                course = "BB", e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectNbJoueurs()
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("Track builder", "Éditeur de circuit"), s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 10 * iScreenScale + "px", s.style.top = 29 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectTypeCreate()
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("Online race", "Course en ligne"), s.style.fontSize = 3 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 40 * iScreenScale + "px", s.style.top = 29 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px", s.onclick = function() {
                course = "VS", e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), selectOnlineScreen()
            }, t.appendChild(s), (s = document.createElement("input")).type = "button", s.value = toLanguage("Home", "Accueil"), s.style.fontSize = 2 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 2 * iScreenScale + "px", s.style.top = 35 * iScreenScale + "px", s.onclick = function() {
                document.location.href = "index.php"
            }, t.appendChild(s)
        } else {
            var o = [toLanguage("VS", "Course VS")],
                r = ["VS"];
            if (isSingle || (o.unshift("Grand Prix"), r.unshift("GP")), (hasChallenges() || myCircuit) && (o.push(toLanguage("Challenges", "Défis")), r.push("CH")), !nid && isSingle || (o.push(toLanguage("Time Trial", "Contre-la-montre")), r.push("CM")), !nid || isSingle && complete && !cShared || (o.push(toLanguage("Online race", "Course en ligne")), r.push("CL")), !isSingle && cupScore) {
                var l = new Image;
                l.src = "images/cups/cup" + (4 - cupScore) + ".png", l.style.width = Math.round(4 * iScreenScale) + "px", l.style.height = Math.round(4 * iScreenScale) + "px", l.style.position = "absolute", o.length < 5 ? (l.style.left = 3 * iScreenScale + "px", l.style.top = Math.round(18 * iScreenScale) + "px") : (l.style.left = 5 * iScreenScale + "px", l.style.top = Math.round(14 * iScreenScale) + "px"), l.className = "pixelated", t.appendChild(l)
            }
            for (i = 0; i < o.length; i++) {
                var s;
                if ((s = document.createElement("input")).type = "button", s.value = o[i], s.style.position = "absolute", o.length < 4) s.style.left = 20 * iScreenScale + "px", s.style.top = Math.round((14 + 6.5 * i) * iScreenScale) + "px", s.style.width = 38 * iScreenScale + "px", s.style.fontSize = Math.round(3.5 * iScreenScale) + "px";
                else if (4 == o.length) s.style.left = (8 + i % 2 * 36) * iScreenScale + "px", s.style.top = (18 + 8 * Math.floor(i / 2)) * iScreenScale + "px", s.style.width = 28 * iScreenScale + "px", s.style.fontSize = 3 * iScreenScale + "px";
                else {
                    var c = [
                        [10, 14],
                        [40, 14],
                        [25, 21],
                        [10, 29],
                        [40, 29]
                    ][i];
                    s.style.left = c[0] * iScreenScale + "px", s.style.top = c[1] * iScreenScale + "px", s.style.fontSize = 3 * iScreenScale + "px", s.style.width = 29 * iScreenScale + "px"
                }
                s.dataset || (s.dataset = {}), s.dataset.course = r[i], s.onclick = function() {
                    course = this.dataset.course, "CL" == course ? document.location.href = "online.old.php?" + (isMCups ? "mid=" + nid : (isSingle ? complete ? "i" : "id" : complete ? "cid" : "sid") + "=" + nid) : (e.style.display = "none", t.innerHTML = "", oContainers[0].removeChild(t), "VS" == course ? selectNbJoueurs() : "CH" == course ? selectChallengesScreen() : selectPlayerScreen(0))
                }, t.appendChild(s)
            }(s = document.createElement("input")).type = "button", s.value = toLanguage("Back", "Retour"), s.style.fontSize = 2 * iScreenScale + "px", s.style.position = "absolute", s.style.left = 2 * iScreenScale + "px", s.style.top = 35 * iScreenScale + "px", s.onclick = function() {
                exitCircuit()
            }, t.appendChild(s)
        }
        var u, p, d, m, y = !(e = document.getElementById("fb-root"));
        if (y ? ((e = document.createElement("div")).id = "fb-root", e.style.position = "absolute") : e.style.display = "", e.style.left = 16 * iScreenScale - 12 + "px", e.style.top = 36 * iScreenScale + 2 + "px", e.style.transform = e.style.WebkitTransform = e.style.MozTransform = "scale(" + iScreenScale / 7 + ")", y) {
            var h = document.createElement("div");
            h.className = "fb-share-button", h.dataset.href = document.location.href, h.dataset.layout = "button", e.appendChild(h), document.body.appendChild(e), u = document, p = "facebook-jssdk", m = u.getElementsByTagName("script")[0], u.getElementById(p) || ((d = u.createElement("script")).id = p, d.src = "//connect.facebook.net/" + (language ? "en_EN" : "fr_FR") + "/sdk.js#xfbml=1&version=v2.4", m.parentNode.insertBefore(d, m))
        }
        var g = document.createElement("img");
        g.src = "images/english.png", g.alt = "En", g.style.position = "absolute", g.style.left = 68 * iScreenScale + "px", g.style.top = 35 * iScreenScale + "px", g.style.width = 4 * iScreenScale + "px", g.style.height = Math.round(8 * iScreenScale / 3) + "px";
        var f = document.createElement("img");
        f.src = "images/french.png", g.alt = "Fr", f.style.position = "absolute", f.style.left = 74 * iScreenScale + "px", f.style.top = 35 * iScreenScale + "px", f.style.width = 4 * iScreenScale + "px", f.style.height = Math.round(8 * iScreenScale / 3) + "px";
        var S = language ? g : f,
            b = language ? f : g;
        S.style.border = "solid 1px yellow", b.style.border = "solid 1px transparent", b.style.cursor = "pointer", b.onmouseover = function() {
            b.style.border = "solid 1px yellow"
        }, b.onmouseout = function() {
            b.style.border = "solid 1px transparent"
        }, b.onclick = function() {
            language = !language, xhr("setLanguage.php", "nLanguage=" + 1 * language, function(e) {
                return 1 == e && (location.reload(), !0)
            })
        }, t.appendChild(g), t.appendChild(f), updateMenuMusic(0)
    }

    function selectMainPage() {
        switch (page) {
            case "OL":
                mId ? selectPlayerScreen(0) : connexion();
                break;
            case "MK":
                selectTypeScreen();
                break;
            case "CI":
            case "MA":
                nid ? selectTypeScreen() : (course = "VS", selectNbJoueurs());
                break;
            case "BA":
            case "AR":
                course = "BB", selectNbJoueurs()
        }
    }

    function selectNbJoueurs() {
        var r = document.createElement("div"),
            e = r.style;
        e.width = iWidth * iScreenScale + "px", e.height = iHeight * iScreenScale + "px", e.border = "solid 1px black", e.backgroundColor = "black", r.appendChild(toTitle(toLanguage("Number of players", "Nombre de joueurs"), .5)), (a = document.createElement("input")).type = "button", a.value = toLanguage("Back", "Retour"), a.style.fontSize = 2 * iScreenScale + "px", a.style.position = "absolute", a.style.left = 2 * iScreenScale + "px", a.style.top = 35 * iScreenScale + "px", a.onclick = function() {
            isBattle || isCup && !nid ? exitCircuit() : (r.innerHTML = "", oContainers[0].removeChild(r), selectTypeScreen())
        }, r.appendChild(a);
        var t = isBattle && cShared;
        for (i = 1; i <= 2; i++) {
            var a;
            (a = document.createElement("input")).type = "button", a.id = "select-nbj-" + i, a.value = i + (i < 2 ? "  " : " ") + toLanguage("player", "joueur") + (i < 2 ? " " : "s"), a.style.fontSize = 4 * iScreenScale + "px", a.style.position = "absolute", a.style.left = (t ? 26 : 27) * iScreenScale + "px", a.style.top = ((t ? 7 : 10) + i * (t ? 7 : 8)) * iScreenScale + "px", t && (a.style.paddingLeft = 2 * iScreenScale + "px", a.style.paddingRight = 2 * iScreenScale + "px"), a.onclick = function() {
                if (r.innerHTML = "", oContainers[0].removeChild(r), "2" == this.value.charAt(0)) {
                    var e = oContainers[0].cloneNode(!1);
                    e.style.left = 10 + iWidth * iScreenScale + "px", oContainers.push(e);
                    for (var t = ["temps", "compteur", "infos", "infoPlace", "lakitu", "drift", "scroller"], a = 0; a < t.length; a++) {
                        var n = document.getElementById(t[a] + 0);
                        if (n) {
                            var o = n.cloneNode(!0);
                            o.id = t[a] + 1, document.body.appendChild(o)
                        }
                    }
                }
                selectPlayerScreen(0)
            }, r.appendChild(a)
        }
        t && ((a = document.createElement("input")).type = "button", a.value = toLanguage("Online mode", "Mode en ligne"), a.style.fontSize = 3 * iScreenScale + "px", a.style.position = "absolute", a.style.left = 26 * iScreenScale + "px", a.style.top = 30 * iScreenScale + "px", a.style.paddingTop = Math.round(.5 * iScreenScale) + "px", a.style.paddingBottom = Math.round(.5 * iScreenScale) + "px", a.onclick = function() {
            document.location.href = "online.old.php?" + (complete ? "i" : "id") + "=" + nid + "&battle"
        }, r.appendChild(a));
        oContainers[0].appendChild(r), !myCircuit && !hasChallenges() || nid && !isBattle || ((a = document.createElement("input")).type = "button", a.value = toLanguage("Challenges...", "Défis..."), a.style.fontSize = 2 * iScreenScale + "px", a.style.position = "absolute", a.style.right = 2 * iScreenScale + "px", a.style.top = 35 * iScreenScale + "px", a.onclick = function() {
            r.innerHTML = "", oContainers[0].removeChild(r), selectChallengesScreen()
        }, r.appendChild(a));
        updateMenuMusic(0)
    }

    function selectOnlineScreen(t) {
        var e, a = document.createElement("div"),
            n = a.style;
        if (n.width = iWidth * iScreenScale + "px", n.height = iHeight * iScreenScale + "px", n.border = "solid 1px black", n.backgroundColor = "black", a.appendChild(toTitle(toLanguage("Online mode", "Mode en ligne"), 2)), (e = document.createElement("input")).type = "button", e.value = toLanguage("Back", "Retour"), e.style.fontSize = 2 * iScreenScale + "px", e.style.position = "absolute", e.style.left = 2 * iScreenScale + "px", e.style.top = 35 * iScreenScale + "px", e.onclick = function() {
                a.innerHTML = "", oContainers[0].removeChild(a), selectTypeScreen()
            }, a.appendChild(e), (e = document.createElement("input")).type = "button", e.style.display = "none", e.value = toLanguage("More options...", "Plus d'options..."), e.style.fontSize = 2 * iScreenScale + "px", e.style.position = "absolute", e.style.left = 60 * iScreenScale + "px", e.style.top = 35 * iScreenScale + "px", e.onclick = function() {
                a.innerHTML = "", oContainers[0].removeChild(a), privateGameOptions(t, function(e) {
                    e && (isCustomOptions(t = e) || (t = null)), selectOnlineScreen(t)
                })
            }, a.appendChild(e), t) {
            var o = document.createElement("div");
            o.style.position = "absolute", o.style.left = "0px", o.style.width = iWidth * iScreenScale + "px", o.style.textAlign = "center", o.style.top = 13 * iScreenScale + "px", o.style.color = "white", o.style.fontSize = 2 * iScreenScale + "px", o.innerHTML = "⚠ " + toLanguage("By choosing specific rules, you might encounter less opponents.", "En choisissant des options spécifiques, vous risquez de trouver moins d'adversaires."), a.appendChild(o)
        }(e = document.createElement("input")).type = "button", e.value = language ? "VS mode" : "Course VS", e.style.fontSize = Math.round(3.5 * iScreenScale) + "px", e.style.position = "absolute", e.style.left = 22 * iScreenScale + "px", e.style.top = (t ? 18 : 17) * iScreenScale + "px", e.style.width = 36 * iScreenScale + "px", e.onclick = function() {
            a.innerHTML = "", oContainers[0].removeChild(a), openOnlineMode(!1, t)
        }, a.appendChild(e), (e = document.createElement("input")).type = "button", e.value = language ? "Battle mode" : "Bataille de ballons", e.style.fontSize = Math.round(3.5 * iScreenScale) + "px", e.style.position = "absolute", e.style.left = 22 * iScreenScale + "px", e.style.top = (t ? 26 : 25) * iScreenScale + "px", e.style.width = 36 * iScreenScale + "px", e.onclick = function() {
            a.innerHTML = "", oContainers[0].removeChild(a), openOnlineMode(!0, t)
        }, a.appendChild(e), oContainers[0].appendChild(a), updateMenuMusic(0)
    }

    function openOnlineMode(t, e) {
        e ? xhr("onlineOptions.php", "options=" + encodeURIComponent(JSON.stringify(e)), function(e) {
            return !!e && (document.location.href = "online.old.php?" + (t ? "battle&" : "") + "key=" + e, !0)
        }) : document.location.href = "online.old.php" + (t ? "?battle" : "")
    }

    function openChallengeEditor() {
        clId && !edittingCircuit ? document.location.href = "challenges.php?cl=" + clId : document.location.href = document.location.href.replace(/\/(\w+)\.php\?(.+)$/g, "/challenges.php?page=$1&$2")
    }

    function selectTypeCreate() {
        var e, t, a, d = document.createElement("div"),
            n = d.style;
        n.width = iWidth * iScreenScale + "px", n.height = iHeight * iScreenScale + "px", n.border = "solid 1px black", n.backgroundColor = "black", d.appendChild(toTitle(toLanguage("Track builder", "Éditeur de circuit"), .5)), (e = document.createElement("div")).style.color = "white", e.style.fontWeight = "normal", e.style.position = "absolute", e.style.fontSize = Math.round(2.5 * iScreenScale) + "px", e.style.left = 2 * iScreenScale + "px", e.style.top = Math.round(14.5 * iScreenScale) + "px", e.style.width = 20 * iScreenScale + "px", e.style.textAlign = "right", e.innerHTML = toLanguage("Quick mode :", "Mode simplifié :"), d.appendChild(e), (a = document.createElement("input")).type = "button", a.value = "Circuit", a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 24 * iScreenScale + "px", a.style.top = 14 * iScreenScale + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "create.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Arena", "Arène"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 36 * iScreenScale + "px", a.style.top = 14 * iScreenScale + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "arene.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Cup", "Coupe"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 48 * iScreenScale + "px", a.style.top = 14 * iScreenScale + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "simplecup.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Multi Cup", "Multicoupe"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 60 * iScreenScale + "px", a.style.top = 14 * iScreenScale + "px", a.style.width = 16 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "simplecups.php"
        }, d.appendChild(a), (e = document.createElement("div")).style.position = "absolute", e.style.color = "white", e.style.fontWeight = "normal", e.style.fontSize = Math.round(2.5 * iScreenScale) + "px", e.style.left = 2 * iScreenScale + "px", e.style.top = Math.round(21.5 * iScreenScale) + "px", e.style.width = 20 * iScreenScale + "px", e.style.textAlign = "right", e.innerHTML = toLanguage("Complete mode :", "Mode complet :"), d.appendChild(e), (a = document.createElement("input")).type = "button", a.value = "Circuit", a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 24 * iScreenScale + "px", a.style.top = Math.round(21 * iScreenScale) + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "draw.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Arena", "Arène"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 36 * iScreenScale + "px", a.style.top = Math.round(21 * iScreenScale) + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "course.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Cup", "Coupe"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 48 * iScreenScale + "px", a.style.top = Math.round(21 * iScreenScale) + "px", a.style.width = 10 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "completecup.php"
        }, d.appendChild(a), (a = document.createElement("input")).type = "button", a.value = toLanguage("Multi Cup", "Multicoupe"), a.style.fontSize = Math.round(2.5 * iScreenScale) + "px", a.style.position = "absolute", a.style.left = 60 * iScreenScale + "px", a.style.top = Math.round(21 * iScreenScale) + "px", a.style.width = 16 * iScreenScale + "px", a.onclick = function() {
            document.location.href = "completecups.php"
        }, d.appendChild(a), (t = document.createElement("a")).style.color = "#CCF", t.style.fontSize = Math.round(2.5 * iScreenScale) + "px", t.style.position = "absolute", t.style.left = 24 * iScreenScale + "px", t.style.top = Math.round(29.5 * iScreenScale) + "px", t.href = "#null", t.innerHTML = toLanguage("Help", "Aide"), t.onclick = function() {
            var p = document.createElement("div");
            p.style.position = "absolute", p.style.left = "0px", p.style.top = "0px", p.style.width = iScreenScale * iWidth + "px", p.style.height = iScreenScale * iHeight + "px", p.style.backgroundColor = "rgba(0,0,0,0.7)", p.style.fontWeight = "normal";
            var e = document.createElement("table");
            e.style.position = "absolute", e.style.left = 30 * iScreenScale + "px", e.style.width = 50 * iScreenScale + "px", e.style.top = 2 * -iScreenScale + "px", e.style.color = "#333", e.style.opacity = .93, e.style.textAlign = "center", e.style.borderSpacing = "0 " + 5 * iScreenScale + "px", e.style.fontSize = 2 * iScreenScale + "px", (t = document.createElement("tr")).style.backgroundColor = "#CCC";
            var t, a = document.createElement("td");
            language ? a.innerHTML = "<strong>Quick mode:</strong> create a track in a few clics thanks to ready-made pieces" : a.innerHTML = "<strong>Mode simplifié :</strong> créez un circuit en quelques clics grâce à des pièces toutes faites", a.style.padding = 2 * iScreenScale + "px " + 3 * iScreenScale + "px", t.appendChild(a), (a = document.createElement("td")).style.width = 10 * iScreenScale + "px", a.style.height = 14 * iScreenScale + "px", a.innerHTML = '<img src="images/help/mode-simple.png" style="height: 100%" alt="Simplify" />', t.appendChild(a), e.appendChild(t), (t = document.createElement("tr")).style.backgroundColor = "#CCC";
            a = document.createElement("td");
            language ? a.innerHTML = "<strong>Complete mode:</strong> create entierely the track from an image you draw yourself" : a.innerHTML = "<strong>Mode complet :</strong> créez entièrement le circuit à partir d'une image dessinée par vous-même", a.style.padding = 2 * iScreenScale + "px " + 3 * iScreenScale + "px", t.appendChild(a), (a = document.createElement("td")).style.width = 10 * iScreenScale + "px", a.style.height = 14 * iScreenScale + "px", a.innerHTML = '<img src="images/help/mode-complete.png" style="height: 100%" alt="Complify" />', t.appendChild(a), e.appendChild(t), p.appendChild(e);
            var n = document.createElement("div");
            n.style.color = "white", n.style.position = "absolute", n.style.fontSize = Math.round(2.5 * iScreenScale) + "px", n.style.right = (iWidth - 22.9) * iScreenScale + "px", n.style.top = Math.round(14 * iScreenScale) + "px", n.style.textAlign = "right", n.style.border = "solid " + Math.round(.4 * iScreenScale) + "px #99C", n.style.padding = Math.round(.1 * iScreenScale) + "px " + Math.round(.5 * iScreenScale) + "px", n.innerHTML = toLanguage("Quick mode :", "Mode simplifié :"), p.appendChild(n);
            var o = .3 * Math.PI,
                i = 3;
            (l = document.createElement("div")).style.position = "absolute", l.style.left = 21 * iScreenScale + "px", l.style.top = Math.round((14.15 - i) * iScreenScale) + "px", l.style.width = Math.round(.5 * iScreenScale) + "px", l.style.height = Math.round(i / Math.cos(o) * iScreenScale) + "px", l.style.backgroundColor = "#99C", l.style.transform = l.style.WebkitTransform = l.style.MozTransform = "rotate(" + Math.round(180 * o / Math.PI) + "deg)", l.style.transformOrigin = l.style.WebkitTransformOrigin = l.style.MozTransformOrigin = "top center", p.appendChild(l), (s = document.createElement("div")).style.position = "absolute", s.style.left = 21 * iScreenScale + "px", s.style.top = Math.round((14.05 - i) * iScreenScale) + "px", s.style.width = Math.round(9 * iScreenScale) + "px", s.style.height = Math.round(.4 * iScreenScale) + "px", s.style.backgroundColor = "#99C", p.appendChild(s);
            var r = document.createElement("div");
            r.style.color = "white", r.style.position = "absolute", r.style.fontSize = Math.round(2.5 * iScreenScale) + "px", r.style.right = (iWidth - 22.9) * iScreenScale + "px", r.style.top = Math.round(21 * iScreenScale) + "px", r.style.textAlign = "right", r.style.border = "solid " + Math.round(.4 * iScreenScale) + "px #99C", r.style.padding = Math.round(.1 * iScreenScale) + "px " + Math.round(.5 * iScreenScale) + "px", r.innerHTML = toLanguage("Complete mode :", "Mode complet :"), p.appendChild(r);
            var l, s;
            o = .3 * Math.PI, i = 3;
            (l = document.createElement("div")).style.position = "absolute", l.style.left = 21 * iScreenScale + "px", l.style.top = Math.round((25.35 - i) * iScreenScale) + "px", l.style.width = Math.round(.5 * iScreenScale) + "px", l.style.height = Math.round(i / Math.cos(o) * iScreenScale) + "px", l.style.backgroundColor = "#99C", l.style.transform = l.style.WebkitTransform = l.style.MozTransform = "rotate(" + Math.round(180 * -o / Math.PI) + "deg)", l.style.transformOrigin = l.style.WebkitTransformOrigin = l.style.MozTransformOrigin = "bottom center", p.appendChild(l), (s = document.createElement("div")).style.position = "absolute", s.style.left = 21 * iScreenScale + "px", s.style.top = Math.round((24.3 + i) * iScreenScale) + "px", s.style.width = Math.round(9 * iScreenScale) + "px", s.style.height = Math.round(.4 * iScreenScale) + "px", s.style.backgroundColor = "#99C", p.appendChild(s);
            var c = document.createElement("input");
            return c.type = "button", c.style.position = "absolute", c.style.left = 8 * iScreenScale + "px", c.style.bottom = 5 * iScreenScale + "px", c.style.fontSize = 3 * iScreenScale + "px", c.value = "Ok →", c.onclick = function() {
                for (; p.childNodes.length;) p.removeChild(p.firstChild);
                var e = document.createElement("div");
                e.style.position = "absolute", e.style.left = 29 * iScreenScale + "px", e.style.top = 12 * iScreenScale + "px", e.style.width = Math.round(.5 * iScreenScale) + "px", e.style.height = 3 * iScreenScale + "px", e.style.backgroundColor = "#99C", p.appendChild(e);
                var t = document.createElement("div");
                t.style.position = "absolute", t.style.left = 41 * iScreenScale + "px", t.style.top = 17 * iScreenScale + "px", t.style.width = Math.round(.5 * iScreenScale) + "px", t.style.height = 3 * iScreenScale + "px", t.style.backgroundColor = "#99C", p.appendChild(t);
                var a = document.createElement("div");
                a.style.position = "absolute", a.style.left = 53 * iScreenScale + "px", a.style.top = 12 * iScreenScale + "px", a.style.width = Math.round(.5 * iScreenScale) + "px", a.style.height = 3 * iScreenScale + "px", a.style.backgroundColor = "#99C", p.appendChild(a);
                var n, o = document.createElement("div");
                o.style.position = "absolute", o.style.left = 68 * iScreenScale + "px", o.style.top = 17 * iScreenScale + "px", o.style.width = Math.round(.5 * iScreenScale) + "px", o.style.height = 3 * iScreenScale + "px", o.style.backgroundColor = "#99C", p.appendChild(o), (n = document.createElement("input")).type = "button", n.value = "Circuit", n.style.fontSize = Math.round(2.5 * iScreenScale) + "px", n.style.position = "absolute", n.style.left = 24 * iScreenScale + "px", n.style.top = 14 * iScreenScale + "px", n.style.width = 10 * iScreenScale + "px", n.style.backgroundColor = "#372F1A", n.style.color = "#F6DA14", p.appendChild(n), (n = document.createElement("input")).type = "button", n.value = toLanguage("Arena", "Arène"), n.style.fontSize = Math.round(2.5 * iScreenScale) + "px", n.style.position = "absolute", n.style.left = 36 * iScreenScale + "px", n.style.top = 14 * iScreenScale + "px", n.style.width = 10 * iScreenScale + "px", n.style.backgroundColor = "#372F1A", n.style.color = "#F6DA14", p.appendChild(n), (n = document.createElement("input")).type = "button", n.value = toLanguage("Cup", "Coupe"), n.style.fontSize = Math.round(2.5 * iScreenScale) + "px", n.style.position = "absolute", n.style.left = 48 * iScreenScale + "px", n.style.top = 14 * iScreenScale + "px", n.style.width = 10 * iScreenScale + "px", n.style.backgroundColor = "#372F1A", n.style.color = "#F6DA14", p.appendChild(n), (n = document.createElement("input")).type = "button", n.value = toLanguage("Multi Cup", "Multicoupe"), n.style.fontSize = Math.round(2.5 * iScreenScale) + "px", n.style.position = "absolute", n.style.left = 60 * iScreenScale + "px", n.style.top = 14 * iScreenScale + "px", n.style.width = 16 * iScreenScale + "px", n.style.backgroundColor = "#372F1A", n.style.color = "#F6DA14", p.appendChild(n);
                var i = document.createElement("div");
                i.style.position = "absolute", i.style.left = 24 * iScreenScale + "px", i.style.top = 14 * iScreenScale + "px", i.style.width = 52 * iScreenScale + "px", i.style.height = 4 * iScreenScale + "px", p.appendChild(i);
                var r = document.createElement("div");
                r.style.position = "absolute", r.style.left = 12 * iScreenScale + "px", r.style.bottom = (iHeight - 12) * iScreenScale + "px", r.style.width = 20 * iScreenScale + "px", r.style.padding = Math.round(.5 * iScreenScale) + "px " + iScreenScale + "px", r.style.backgroundColor = "#CCC", r.style.color = "#333", r.style.fontSize = 2 * iScreenScale + "px", language ? r.innerHTML = '<strong>Circuit:</strong> Create a track and play against your opponents in <strong style="color:#393">VS mode</strong>' : r.innerHTML = '<strong>Circuit :</strong> Créez une piste et affrontez vos adversaires en <strong style="color:#393">course VS</strong>', p.appendChild(r);
                var l = document.createElement("div");
                l.style.position = "absolute", l.style.left = 28 * iScreenScale + "px", l.style.top = 20 * iScreenScale + "px", l.style.width = 20 * iScreenScale + "px", l.style.padding = Math.round(.5 * iScreenScale) + "px " + iScreenScale + "px", l.style.backgroundColor = "#CCC", l.style.color = "#333", l.style.fontSize = 2 * iScreenScale + "px", language ? l.innerHTML = '<strong>Arena:</strong> Create a battle course and play in mode <strong style="color:#393">Balloon battle</strong>' : l.innerHTML = '<strong>Arène :</strong> Créez une zone de combat et jouez en mode <strong style="color:#393">bataille de ballons</strong>', p.appendChild(l);
                var s = document.createElement("div");
                s.style.position = "absolute", s.style.left = 44 * iScreenScale + "px", s.style.bottom = (iHeight - 12) * iScreenScale + "px", s.style.width = 20 * iScreenScale + "px", s.style.padding = Math.round(.5 * iScreenScale) + "px " + iScreenScale + "px", s.style.backgroundColor = "#CCC", s.style.color = "#333", s.style.fontSize = 2 * iScreenScale + "px", language ? s.innerHTML = '<strong>Cup:</strong> Create a <strong style="color:#393">Grand Prix</strong> cup from 4 of your circuits' : s.innerHTML = '<strong>Coupe :</strong> Créer une coupe <strong style="color:#393">Grand Prix</strong> à partir de 4 de vos circuits', p.appendChild(s);
                var c = document.createElement("div");
                c.style.position = "absolute", c.style.left = 58 * iScreenScale + "px", c.style.top = 20 * iScreenScale + "px", c.style.width = 20 * iScreenScale + "px", c.style.padding = Math.round(.5 * iScreenScale) + "px " + iScreenScale + "px", c.style.backgroundColor = "#CCC", c.style.color = "#333", c.style.fontSize = 2 * iScreenScale + "px", language ? c.innerHTML = '<strong>Multicup:</strong> Merge <strong style="color:#393">several cups</strong> in a same page to form a series!' : c.innerHTML = '<strong>Multicoupe :</strong> Réunissez <strong style="color:#393">plusieurs coupes</strong> sur une seule page pour former une série !', p.appendChild(c);
                var u = document.createElement("input");
                u.type = "button", u.style.position = "absolute", u.style.left = 8 * iScreenScale + "px", u.style.bottom = 5 * iScreenScale + "px", u.style.fontSize = 3 * iScreenScale + "px", u.value = "Ok ✓", u.onclick = function() {
                    d.removeChild(p)
                }, p.appendChild(u)
            }, p.appendChild(c), d.appendChild(p), !1
        }, d.appendChild(t), (t = document.createElement("a")).style.color = "#CCF", t.style.fontSize = Math.round(2.5 * iScreenScale) + "px", t.style.position = "absolute", t.style.left = 34 * iScreenScale + "px", t.style.top = Math.round(29.5 * iScreenScale) + "px", t.href = "creations.php", t.innerHTML = toLanguage("List of creations", "Liste des créations"), d.appendChild(t), oContainers[0].appendChild(d), (a = document.createElement("input")).type = "button", a.value = toLanguage("Back", "Retour"), a.style.fontSize = 2 * iScreenScale + "px", a.style.position = "absolute", a.style.left = 2 * iScreenScale + "px", a.style.top = 35 * iScreenScale + "px", a.onclick = function() {
            d.innerHTML = "", oContainers[0].removeChild(d), selectTypeScreen()
        }, d.appendChild(a), updateMenuMusic(0)
    }

    function selectPlayerScreen(IdJ, newP, nbSels) {
        var isCustomSel = void 0 !== nbSels;
        if (!IdJ) {
            for (joueurs in strPlayer = [], aPlayers = [], cp) aPlayers.push(joueurs);
            updateCommandSheet()
        }
        fInfos = fInfos || {};
        var oScr = document.createElement("div");
        newP && (oScr.style.visibility = "hidden");
        var oStyle = oScr.style,
            oTitle, oMsg;
        (oStyle.width = iWidth * iScreenScale + "px", oStyle.height = iHeight * iScreenScale + "px", oStyle.border = "solid 1px black", oStyle.backgroundColor = "black", isCustomSel) ? (oMsg = IdJ >= oContainers.length ? toLanguage("Choose CPU", "Choisissez ordi") + " " + (IdJ + 1 - oContainers.length) : 1 == oContainers.length ? toLanguage("Choose player", "Choisissez joueur") : toLanguage("Choose player ", "Choisissez joueur ") + (IdJ + 1), oTitle = toTitle(oMsg, 0), oTitle.style.color = "#F90") : oTitle = toTitle(toLanguage("Choose a player", "Choisissez un joueur"), 0);
        oScr.appendChild(oTitle), vitesse = 15 * iScreenScale;
        var cTable = document.createElement("table");
        cTable.style.display = "none", cTable.style.position = "absolute", cTable.style.top = 36 * iScreenScale + 16 + "px", cTable.style.left = 25 * iScreenScale - 60 + "px", cTable.style.textAlign = "left", cTable.style.fontSize = 2 * iScreenScale + "pt", cTable.style.color = "white", cTable.setAttribute("cellpadding", 2), cTable.setAttribute("cellspacing", 2), document.body.appendChild(cTable);
        var hTr = document.createElement("tr"),
            hTd1 = document.createElement("td");
        hTd1.innerHTML = "&nbsp;", hTr.appendChild(hTd1);
        var hTd2 = document.createElement("td");
        hTd2.className = "maj", hTd2.innerHTML = "&nbsp;", hTd2.style.fontWeight = "bold", hTr.appendChild(hTd2), cTable.appendChild(hTr);
        for (var sCaracteristiques = [toLanguage("Acceleration", "Accélération"), toLanguage("Max speed", "Vitesse max"), toLanguage("Handling", "Maniabilité")], dCaracteristiques = new Array, i = 0; i < sCaracteristiques.length; i++) {
            var oTr = document.createElement("tr"),
                oTd1 = document.createElement("td");
            oTd1.className = "rgt", oTd1.innerHTML = sCaracteristiques[i] + " :", oTr.appendChild(oTd1);
            var oTd2 = document.createElement("td");
            dCaracteristiques[i] = document.createElement("div"), dCaracteristiques[i].style.backgroundColor = "#838057", dCaracteristiques[i].style.border = "solid 1px silver", dCaracteristiques[i].style.height = 2 * iScreenScale + "px", dCaracteristiques[i].innerHTML = "&nbsp;", oTd2.appendChild(dCaracteristiques[i]), oTr.appendChild(oTd2), cTable.appendChild(oTr)
        }

        function createPersoSelector(e) {
            var t = document.createElement("div");
            t.style.backgroundColor = "#78D0F8", t.style.position = "absolute", t.style.width = 5 * iScreenScale + "px", t.style.height = 5 * iScreenScale + "px", t.style.borderTop = "double 4px black", t.style.borderLeft = "double 4px #F8F8F8", t.style.borderRight = "double 4px #F8F8F8", t.style.borderBottom = "solid 5px #00B800", t.style.overflow = "hidden";
            var a = new Image;
            if (a.style.height = 5 * iScreenScale + "px", a.style.position = "absolute", a.className = "pixelated", pUnlocked[e]) {
                for (var n = !0, o = aPlayers[e], i = 0; i < strPlayer.length; i++) strPlayer[i] == o && (n = !1, i = strPlayer.length);
                a.src = n ? getSpriteSrc(o) : getStarSrc(o), a.alt = aPlayers[e], a.nb = e, a.style.left = -30 * iScreenScale + "px", a.style.cursor = "pointer", a.id = "perso-selector-" + o, a.j = IdJ, a.onmouseover = function() {
                    cTable.style.display = "block", hTd2.innerHTML = toPerso(this.alt);
                    for (var e = [2.5, 5, 2.5], t = [.2, .8, .2], a = 0; a < dCaracteristiques.length; a++) dCaracteristiques[a].style.width = vitesse * ((cp[this.alt][a] - t[a]) * e[a] + 1) + "px";
                    tourne = this.nb, tourner()
                }, a.onmouseout = function() {
                    cTable.style.display = "none", this.style.left = -6 * parseFloat(this.style.height) + "px", tourne = -1
                }, a.onclick = function() {
                    tourne = -1, strPlayer[this.j] = this.alt;
                    var e = "";
                    if (isOnline || (e = "VS" == course ? (iDificulty = 4 + .5 * selectedDifficulty, "difficulty=" + selectedDifficulty + "&players=" + fInfos.nbPlayers + "&team=" + fInfos.teams) : "players=" + fInfos.nbPlayers + "&team=" + fInfos.teams), oScr.innerHTML = "", this.j++, oContainers[0].removeChild(oScr), document.body.removeChild(cTable), this.j == (isCustomSel ? nbSels : oContainers.length)) {
                        if (isOnline) aPlayers = [strPlayer[0]];
                        else if ("CM" == course) aPlayers = [];
                        else {
                            if (aPlayers = [], isCustomSel) {
                                for (var t = strPlayer.length - 1; t >= oContainers.length; t--) aPlayers.push(strPlayer[t]);
                                strPlayer.splice(oContainers.length)
                            } else {
                                t = 0;
                                for (joueurs in cp) pUnlocked[t] && (aPlayers.push(joueurs), t++);
                                if (aPlayers.sort(function() {
                                        return .5 - Math.random()
                                    }), aPlayers.length < fInfos.nbPlayers) {
                                    var a = aPlayers.length;
                                    aPlayers.length = aPlayers.length * Math.ceil(fInfos.nbPlayers / aPlayers.length);
                                    for (t = a; t < aPlayers.length; t++) aPlayers[t] = aPlayers[t % a]
                                } else
                                    for (t = 0; t < aPlayers.length; t++)
                                        for (var n = aPlayers[t], o = 0; o < strPlayer.length; o++) strPlayer[o] == n && (aPlayers.splice(t, 1), t--, o = strPlayer.length);
                                var i = "GP" != course ? aPlayers.length - fInfos.nbPlayers + strPlayer.length : aPlayers.length - 7;
                                aPlayers.splice(0, i)
                            }
                            aPlaces = [];
                            for (t = 0; t < strPlayer.length; t++) aPlaces[t] = aPlayers.length + t + 1;
                            for (t = 0; t < aPlayers.length; t++) aPlaces[t + strPlayer.length] = t + 1;
                            for (t = 0; t < aPlaces.length; t++) aScores[t] = 0;
                            clRuleVars = {}, clGlobalVars = void 0, "GP" != course && (selectedPlayers = fInfos.nbPlayers, selectedTeams = fInfos.teams, xhr("updateCourseOptions.php", e, function(e) {
                                return 1 == e
                            }))
                        }
                        isOnline ? searchCourse() : isTeamPlay() ? selectTeamScreen(0) : selectTrackScreen()
                    } else selectPlayerScreen(this.j, void 0, nbSels);
                    var r = /^cp-\w+-(\d+)$/g.exec(this.alt);
                    r && xhr("selectPerso.php", "id=" + r[1], function() {
                        return !0
                    })
                }
            } else a.src = "images/kart_locked.png";
            return t.appendChild(a), t
        }
        for (var i = 0; i < nBasePersos; i++) {
            var oDiv = createPersoSelector(i);
            oDiv.style.left = (i % 7 * 8 + 9) * iScreenScale + "px", oDiv.style.top = (10 + 7 * Math.floor(i / 7)) * iScreenScale + "px", oScr.appendChild(oDiv)
        }
        var pDiv = document.createElement("div");
        pDiv.style.backgroundColor = "#78D0F8", pDiv.style.position = "absolute", pDiv.style.width = 5 * iScreenScale + "px", pDiv.style.height = 5 * iScreenScale + "px", pDiv.style.left = 67 * iScreenScale + "px", pDiv.style.top = 24 * iScreenScale + "px", pDiv.style.borderTop = "double 4px black", pDiv.style.borderLeft = "double 4px #F8F8F8", pDiv.style.borderRight = "double 4px #F8F8F8", pDiv.style.borderBottom = "solid 5px #00B800", pDiv.style.overflow = "hidden";
        var pPImg = new Image;
        if (pPImg.style.height = 5 * iScreenScale + "px", pPImg.style.position = "absolute", pPImg.src = "images/kart_persos.png", pPImg.style.cursor = "pointer", pPImg.title = language ? "Character editor" : "Éditeur de personnages", pPImg.className = "pixelated", pPImg.onclick = function() {
                window.open("choosePerso.php", "chose", "scrollbars=1, resizable=1, width=500, height=500")
            }, pDiv.appendChild(pPImg), oScr.appendChild(pDiv), oContainers[0].appendChild(oScr), isOnline)
            if (shareLink.key) {
                if (shareLink.player == identifiant) {
                    var oPInput = document.createElement("input");
                    oPInput.type = "button", oPInput.value = toLanguage("Private game options...", "Options de la partie privée..."), oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 52 * iScreenScale + "px", oPInput.style.top = 35 * iScreenScale + "px", oPInput.onclick = function() {
                        oScr.innerHTML = "", oContainers[0].removeChild(oScr), privateGameOptions(shareLink.options, function(t) {
                            t && (isCustomOptions(t) || isCustomOptions(shareLink.options)) ? xhr("privateGameOptions.php", "key=" + shareLink.key + "&options=" + encodeURIComponent(JSON.stringify(t)), function(e) {
                                return 1 == e && (shareLink.options || (shareLink.options = {}), shareLink.options.team = t.team, shareLink.options.manualTeams = t.manualTeams, shareLink.options.friendly = t.friendly, selectedTeams = t.team, selectPlayerScreen(0), !0)
                            }) : selectPlayerScreen(0)
                        })
                    }, oScr.appendChild(oPInput)
                }
            } else {
                var oPInput = document.createElement("input");
                oPInput.type = "button", oPInput.value = toLanguage("Private game...", "Partie privée..."), oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 62 * iScreenScale + "px", oPInput.style.top = 35 * iScreenScale + "px", oPInput.onclick = function() {
                    oScr.innerHTML = "", oContainers[0].removeChild(oScr), privateGame()
                }, oScr.appendChild(oPInput)
            } if (isOnline || "VS" != course && "BB" != course) {
            if ("CM" == course && isSingle) {
                var oClassement = document.createElement("input");
                oClassement.type = "button", oClassement.value = toLanguage("Rankings", "Classement"), oClassement.style.position = "absolute", oClassement.style.fontSize = 3 * iScreenScale + "px", oClassement.style.position = "absolute", oClassement.style.left = 30 * iScreenScale - 10 + "px", oClassement.style.top = 32 * iScreenScale + "px", oClassement.style.width = 20 * iScreenScale + "px", oClassement.onclick = openRankings, oScr.appendChild(oClassement)
            }
        } else {
            var oForm = document.createElement("form");
            if (oForm.onsubmit = function() {
                    return !1
                }, oForm.style.position = "absolute", oForm.style.top = 32 * iScreenScale - 5 + "px", oForm.style.left = 18 * iScreenScale + "px", oForm.style.fontSize = 2 * iScreenScale + "px", oForm.style.zIndex = 2, IdJ || newP || (iDificulty = selectedDifficulty, fInfos.nbPlayers = selectedPlayers, fInfos.teams = selectedTeams), "VS" == course) {
                oForm.appendChild(document.createTextNode(toLanguage("Difficulty: ", "Difficulté : ")));
                var iDifficulties = [toLanguage("Easy", "Facile"), toLanguage("Medium", "Moyen"), toLanguage("Difficult", "Difficile")],
                    oSelect = document.createElement("select");
                oSelect.name = "difficulty", oSelect.style.width = "auto", oSelect.style.fontSize = 2 * iScreenScale + "px", oSelect.style.marginRight = "10px", oSelect.onchange = function() {
                    selectedDifficulty = this.selectedIndex
                };
                for (var i = 0; i < iDifficulties.length; i++) {
                    var oOption = document.createElement("option");
                    oOption.value = i, oOption.innerHTML = iDifficulties[i], selectedDifficulty == i && (oOption.selected = "selected"), oSelect.appendChild(oOption)
                }
                oForm.appendChild(oSelect)
            } else iDificulty = 4.5;
            if ("VS" == course || "BB" == course) {
                oForm.appendChild(document.createTextNode(toLanguage("Teams: ", "Équipes : ")));
                var oSelect = document.createElement("select");
                oSelect.name = "difficulty", oSelect.style.width = 15 * iScreenScale + 15 + "px", oSelect.style.fontSize = 2 * iScreenScale + "px", oSelect.onchange = function() {
                    fInfos.teams = this.selectedIndex
                };
                for (var iTeams = [toLanguage("No teams", "Chacun pour soi"), toLanguage("Team Game", "Match par équipes")], i = 0; i < iTeams.length; i++) {
                    var oOption = document.createElement("option");
                    oOption.value = i, oOption.innerHTML = iTeams[i], selectedTeams == i && (oOption.selected = "selected"), oSelect.appendChild(oOption)
                }
                oForm.appendChild(oSelect)
            }
            oForm.appendChild(document.createElement("br")), oForm.appendChild(document.createTextNode(toLanguage("Number of participants", "Nombre de participants ") + ": "));
            var oSelect = document.createElement("select");

            function setCustomValue(e, t) {
                for (var a = e.getElementsByTagName("option"), n = 0; n < a.length; n++) {
                    var o = +a[n].value;
                    if (o == t) {
                        e.selectedIndex = n;
                        break
                    }
                    if (-1 == o || t < o) {
                        var i = document.createElement("option");
                        i.value = t, i.innerHTML = t, e.insertBefore(i, a[n]), e.selectedIndex = n;
                        break
                    }
                }
                e.value = t
            }
            oSelect.name = "nbj", oSelect.style.width = 3 * iScreenScale + 20 + "px", oSelect.style.fontSize = 2 * iScreenScale + "px";
            for (var i = 2; i <= 8; i++) {
                var oOption = document.createElement("option");
                oOption.value = i, oOption.innerHTML = i, oSelect.appendChild(oOption)
            }
            var oOption = document.createElement("option");
            oOption.value = -1, oOption.innerHTML = toLanguage("More...", "Plus..."), oSelect.appendChild(oOption), setCustomValue(oSelect, fInfos.nbPlayers), oSelect.onchange = function() {
                if (-1 == this.value) {
                    var e = parseInt(prompt(toLanguage("Enter number", "Nombre de joueurs :")));
                    !isNaN(e) && 1 < e ? setCustomValue(this, Math.min(e, 999)) : (isNaN(e) || alert(toLanguage("Invalid value", "Valeur invalide")), setCustomValue(this, fInfos.nbPlayers))
                }
                fInfos.nbPlayers = parseInt(this.value)
            }, oForm.appendChild(oSelect);
            var oChoosePerso = document.createElement("a");
            if (oChoosePerso.innerHTML = toLanguage("Choose characters...", "Choix des persos..."), oChoosePerso.href = "#null", oChoosePerso.style.display = "inline-block", oChoosePerso.style.marginLeft = 2 * iScreenScale + "px", oChoosePerso.style.color = "white", oChoosePerso.onclick = function() {
                    return selectedDifficulty = iDificulty, selectedPlayers = fInfos.nbPlayers, selectedTeams = fInfos.teams, tourne = -1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), selectPlayerScreen(IdJ, !1, fInfos.nbPlayers), !1
                }, oForm.appendChild(oChoosePerso), oScr.appendChild(oForm), isCustomSel) {
                oForm.style.display = "none";
                var oStepCtn = document.createElement("div");
                oStepCtn.style.position = "absolute", oStepCtn.style.left = "0px", oStepCtn.style.width = iWidth * iScreenScale + "px", oStepCtn.style.textAlign = "center", oStepCtn.style.top = 32 * iScreenScale + "px";
                var oStepBack = document.createElement("input");
                oStepBack.type = "button", oStepBack.style.fontSize = 3 * iScreenScale + "px", IdJ ? (oStepBack.value = "◄", oStepBack.style.marginRight = 3 * iScreenScale + "px") : (oStepBack.style.width = "0px", oStepBack.value = " ", oStepBack.style.visibility = "hidden"), oStepBack.onclick = function() {
                    tourne = -1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), strPlayer.pop(), selectPlayerScreen(IdJ - 1, !1, fInfos.nbPlayers)
                }, oStepCtn.appendChild(oStepBack);
                var oStepValue = document.createElement("span");
                oStepValue.style.fontSize = 3 * iScreenScale + "px", oStepValue.innerHTML = toLanguage("Character", "Perso") + " " + (IdJ + 1) + "/" + nbSels, oStepCtn.appendChild(oStepValue), oStepBack.style.color = oStepValue.style.color = "#F90", oScr.appendChild(oStepCtn)
            }
        }
        var oPInput = document.createElement("input");

        function addMyPersos(e) {
            for (var t in cp = {}, baseCp) cp[t] = baseCp[t];
            customPersos = {};
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                cp[n.sprites] = [n.acceleration, n.speed, n.handling], customPersos[n.sprites] = n
            }
            for (t in aPlayers = [], cp) aPlayers.push(t);
            for (a = 0; a < e.length; a++) {
                var o = nBasePersos + a;
                pUnlocked[o] = 1;
                var i = createPersoSelector(o);
                if (newP && !a && i.firstChild.onclick) return void i.firstChild.onclick();
                i.style.left = 67 * iScreenScale + "px", i.style.top = (10 + 7 * a) * iScreenScale + "px", oScr.insertBefore(i, pDiv)
            }
            oScr.style.visibility = "visible"
        }
        oPInput.type = "button", oPInput.value = toLanguage("Back", "Retour"), oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 2 * iScreenScale + "px", oPInput.style.top = 35 * iScreenScale + "px", oPInput.onclick = function() {
            if (oScr.innerHTML = "", oContainers[0].removeChild(oScr), document.body.removeChild(cTable), isCustomSel) selectPlayerScreen(0);
            else if (displayCommands("&nbsp;"), isOnline) connexion();
            else if ("VS" == course || "BB" == course) {
                for (var e = 1; e < oContainers.length; e++) oContainers.splice(e, 1);
                selectNbJoueurs()
            } else selectTypeScreen()
        }, isCustomSel && (oPInput.style.color = "#F90"), oScr.appendChild(oPInput), newP && (myPersosCache = void 0), myPersosCache ? addMyPersos(myPersosCache) : xhr("myPersos.php", null, function(res) {
            if (oScr.dataset && oScr.dataset.bypass) return !0;
            var newPersos = [];
            try {
                newPersos = eval(res)
            } catch (e) {}
            if (newPersos.length) {
                for (var i = 0; i < newPersos.length; i++) {
                    newPersos[i].acceleration = 0.2 + 0.8 * newPersos[i].acceleration, newPersos[i].speed = 0.8 + 0.4 * newPersos[i].speed, newPersos[i].handling = 0.2 + 0.8 * newPersos[i].handling
                }
                addMyPersos(newPersos);
                myPersosCache = newPersos
            } else oScr.style.visibility = "visible";
            return !0
        }), selectPerso = function(e) {
            tourne = -1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), xhr("selectPerso.php", "id=" + e, function(e) {
                return selectPlayerScreen(IdJ, !0, nbSels), !0
            })
        }, updateMenuMusic(isOnline ? 0 : 1)
    }

    function isCustomOptions(e) {
        return e && (e.team || e.manualTeams || e.friendly)
    }

    function hasChallenges() {
        for (var e in challenges)
            for (var t in challenges[e]) return !0
    }

    function isTeamPlay() {
        switch (course) {
            case "BB":
            case "VS":
                return selectedTeams
        }
        return 0
    }

    function selectTeamScreen(a) {
        a || (aTeams.length = 0);
        var n = document.createElement("div"),
            e = n.style;
        e.width = iWidth * iScreenScale + "px", e.height = iHeight * iScreenScale + "px", e.border = "solid 1px black", e.backgroundColor = "black";
        var t = toLanguage("Select team", "Sélectionner équipe");
        1 < strPlayer.length && (t += " (" + toLanguage("P", "J") + (a + 1) + ")");
        var o = toTitle(t, .5);
        for (1 < strPlayer.length && (o.style.fontSize = Math.round(7 * iScreenScale) + "px"), n.appendChild(o), (r = document.createElement("input")).type = "button", r.value = toLanguage("Back", "Retour"), r.style.fontSize = 2 * iScreenScale + "px", r.style.position = "absolute", r.style.left = 2 * iScreenScale + "px", r.style.top = 35 * iScreenScale + "px", r.onclick = function() {
                n.innerHTML = "", oContainers[0].removeChild(n), selectPlayerScreen(0)
            }, n.appendChild(r), i = 0; i < 2; i++) {
            var r;
            (r = document.createElement("input")).type = "button", r.value = i ? toLanguage("Red team", "Équipe rouge") : toLanguage("Blue team", "Équipe bleue"), r.i = i, r.style.fontSize = 4 * iScreenScale + "px", r.style.position = "absolute", r.style.left = 25 * iScreenScale + "px", r.style.top = (16 + 9 * i) * iScreenScale + "px", r.style.width = 30 * iScreenScale + "px", r.onclick = function() {
                n.innerHTML = "", oContainers[0].removeChild(n);
                var e = +this.i;
                if (aTeams.push(e), aTeams.length >= strPlayer.length) {
                    for (var t = 0; t < strPlayer.length; t++) aTeams.push(1 - aTeams[t]);
                    for (t = strPlayer.length; t < aPlayers.length; t++) aTeams.push((t + e + aPlayers.length) % 2);
                    selectTrackScreen()
                } else selectTeamScreen(a + 1)
            }, n.appendChild(r)
        }
        oContainers[0].appendChild(n), updateMenuMusic(1)
    }

    function selectTrackScreen() {
        "BB" != course ? selectMapScreen() : "MK" == page ? selectMapScreen() : selectRaceScreen(0)
    }

    function selectGamersScreen() {
        !isOnline && isTeamPlay() ? selectTeamScreen(0) : selectPlayerScreen(0)
    }

    function acceptRulesScreen() {
        var e, t = document.createElement("div"),
            a = t.style;
        a.width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black", (e = shareLink.options.public ? toTitle(toLanguage("Game rules", "Règles parties"), 0) : toTitle(toLanguage("Private game rules", "Règles partie privée"), 0)).style.fontSize = 7 * iScreenScale + "px", t.appendChild(e);
        var n = document.createElement("div");
        n.style.position = "absolute", n.style.left = "0px", n.style.top = 9 * iScreenScale + "px", n.style.width = iWidth * iScreenScale + "px";
        var o = document.createElement("div");
        o.style.maxHeight = 24 * iScreenScale + "px", o.style.overflow = "auto", (u = document.createElement("div")).style.textAlign = "center", u.style.color = "#F90", u.style.fontSize = 2 * iScreenScale + "px", u.style.lineHeight = 3 * iScreenScale + "px", shareLink.options.public ? u.innerHTML = "⚠ " + toLanguage("Games from this mode have special rules", "Les parties de ce mode utilisent des règles spécifiques") : u.innerHTML = "⚠ " + toLanguage("Games from this private link have special rules", "Les parties de ce lien privé utilisent des règles spécifiques"), o.appendChild(u);
        var i = document.createElement("table");
        if (i.style.marginLeft = "auto", i.style.marginRight = "auto", shareLink.options.team) {
            var r = document.createElement("tr"),
                l = document.createElement("td");
            (s = document.createElement("label")).setAttribute("for", "option-teams"), (c = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", c.style.marginTop = "0px", c.style.marginBottom = "0px", c.innerHTML = toLanguage("Team games", "Parties par équipe"), s.appendChild(c), (u = document.createElement("div")).style.fontSize = 2 * iScreenScale + "px", u.style.color = "white", u.innerHTML = toLanguage("2 teams are selected in each game. You object: defeat the opposing team.", "2 équipes sont sélectionnées à chaque partie. Votre objectif : vaincre l'équipe adverse."), s.appendChild(u), l.appendChild(s), r.appendChild(l), i.appendChild(r)
        }
        if (shareLink.options.manualTeams) {
            r = document.createElement("tr"), l = document.createElement("td");
            (s = document.createElement("label")).setAttribute("for", "option-friendly"), l.appendChild(s), (c = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", c.innerHTML = toLanguage("Manual selection", "Sélection manuelle"), c.style.marginBottom = "0px", s.appendChild(c), (u = document.createElement("div")).style.fontSize = 2 * iScreenScale + "px", u.style.color = "white", u.innerHTML = toLanguage("Teams are selected manually by one of the players.", "Les équipes sont sélectionnées manuellement par l'un des joueurs."), s.appendChild(u), l.appendChild(s), r.appendChild(l), i.appendChild(r)
        }
        if (shareLink.options.friendly) {
            var s, c, u;
            r = document.createElement("tr"), l = document.createElement("td");
            (s = document.createElement("label")).setAttribute("for", "option-friendly"), l.appendChild(s), (c = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", c.innerHTML = toLanguage("Friendly game", "Matchs amicaux"), c.style.marginBottom = "0px", s.appendChild(c), (u = document.createElement("div")).style.fontSize = 2 * iScreenScale + "px", u.style.color = "white", u.innerHTML = toLanguage("Games won't make you win or lose points in the online mode.", "Les parties ne vous feront pas gagner ou perdre de points dans le mode en ligne."), s.appendChild(u), l.appendChild(s), r.appendChild(l), i.appendChild(r)
        }
        o.appendChild(i), n.appendChild(o), (u = document.createElement("div")).style.textAlign = "center", u.style.marginTop = 2 * iScreenScale + "px";
        var p = document.createElement("input");
        p.type = "button", p.value = toLanguage("Accept and play", "Accepter et jouer"), p.style.fontSize = 3 * iScreenScale + "px", p.onclick = function() {
            t.innerHTML = "", oContainers[0].removeChild(t), shareLink.accepted = !0, searchCourse()
        }, u.appendChild(p), n.appendChild(u), t.appendChild(n);
        var d = document.createElement("input");
        d.type = "button", d.value = toLanguage("Back", "Retour"), d.style.fontSize = 2 * iScreenScale + "px", d.style.position = "absolute", d.style.left = 2 * iScreenScale + "px", d.style.top = 35 * iScreenScale + "px", d.onclick = function() {
            t.innerHTML = "", oContainers[0].removeChild(t), selectPlayerScreen(0)
        }, t.appendChild(d), oContainers[0].appendChild(t)
    }

    function selectChallengesScreen() {
        var e = document.createElement("div"),
            t = e.style;
        t.width = iWidth * iScreenScale + "px", t.height = iHeight * iScreenScale + "px", t.border = "solid 1px black", t.backgroundColor = "black";
        var a = toTitle(toLanguage("Challenges", "Défis"), 0);
        a.style.fontSize = 7 * iScreenScale + "px", e.appendChild(a);
        var n = document.createElement("div");
        n.style.position = "absolute", n.style.left = "0px", n.style.top = 9 * iScreenScale + "px", n.style.width = iWidth * iScreenScale + "px";
        var o = document.createElement("div");
        o.style.maxHeight = 24 * iScreenScale + "px", o.style.overflowX = "hidden", o.style.overflowY = "auto";
        var i, r = hasChallenges();
        if (r) {
            if (document.getElementById("comment-connect")) {
                var l = document.createElement("div");
                l.style.width = (iWidth - 5) * iScreenScale + "px", l.style.marginLeft = "auto", l.style.marginRight = "auto", l.style.marginBottom = Math.round(1.5 * iScreenScale) + "px", l.style.textAlign = "center", l.innerHTML = language ? 'You are not connected. The challenges you complete will not be saved. <a href="forum.php" target="_blank" style="color:white">Click here</a> to log in or register.' : 'Vous n\'êtes pas connecté. Les défis réussis ne seront pas sauvegardés. <a href="forum.php" target="_blank" style="color:white">Cliquez ici</a> pour vous connecter ou vous inscrire.', l.style.fontSize = Math.round(1.8 * iScreenScale) + "px", o.appendChild(l)
            }
            var s = document.createElement("table");
            for (var c in s.style.width = (iWidth - 3) * iScreenScale + "px", s.style.marginLeft = "auto", s.style.marginRight = "auto", s.style.borderCollapse = "collapse", challenges)
                for (var u in challenges[c]) {
                    var p = challenges[c][u];
                    if (!p.main) {
                        (g = document.createElement("tr")).style.border = "solid 1px white", (v = document.createElement("td")).setAttribute("colspan", 2);
                        var d = document.createElement("h1"),
                            m = "";
                        switch (c) {
                            case "mcup":
                                m = toLanguage("Multicup", "Multicoupe");
                                break;
                            case "cup":
                                m = toLanguage("Cup", "Coupe");
                                break;
                            case "track":
                                m = toLanguage("Track", "Circuit")
                        }
                        d.innerHTML = m + ' <span style="color:#FDB">' + p.name + "</span>", d.style.textAlign = "center", d.style.margin = "0px", d.style.fontSize = Math.round(4 * iScreenScale) + "px", d.style.paddingTop = Math.round(.5 * iScreenScale) + "px", d.style.paddingBottom = Math.round(.5 * iScreenScale) + "px", d.style.backgroundColor = "#fa7c1b", d.style.color = "white", v.appendChild(d), g.appendChild(v), s.appendChild(g)
                    }
                    for (var y = p.list, h = 0; h < y.length; h++) {
                        var g, f = y[h],
                            S = "active" == f.status && f.succeeded,
                            b = S ? "#9E9" : "white";
                        if ((g = document.createElement("tr")).style.border = "solid 1px " + b, S && (g.style.backgroundColor = "#031"), (v = document.createElement("td")).style.padding = iScreenScale + " " + iScreenScale + "px", f.name)(d = document.createElement("h1")).style.fontSize = 3 * iScreenScale + "px", d.style.marginTop = "0px", d.style.marginBottom = "0px", d.innerHTML = f.name, v.appendChild(d);
                        var v, C = document.createElement("div");
                        if (f.name || f.description.extra ? C.style.fontSize = 2 * iScreenScale + "px" : C.style.fontSize = Math.round(2.5 * iScreenScale) + "px", C.style.color = b, C.style.fontWeight = "bold", C.innerHTML = f.description.main, v.appendChild(C), f.description.extra)(C = document.createElement("div")).style.fontSize = Math.round(1.6 * iScreenScale) + "px", C.style.color = b, C.innerHTML = f.description.extra, v.appendChild(C);
                        if ("active" != f.status) {
                            switch ((C = document.createElement("div")).style.fontSize = Math.round(1.6 * iScreenScale) + "px", C.style.color = "#FC0", f.status) {
                                case "pending_completion":
                                    C.innerHTML = toLanguage("This challenge is pending completion. Succeed it to publish it.", "Ce défi est en attente de réussite. Réussissez-le pour le publier.");
                                    break;
                                case "pending_publication":
                                    C.innerHTML = toLanguage("This challenge is pending publication. Click on &quot;Manage challenges&quot; to publish it.", "Ce défi est en attente de publication. Cliquez sur &quot;Gérer les défis&quot; pour le publier.");
                                    break;
                                case "pending_moderation":
                                    C.innerHTML = toLanguage("This challenge is pending moderation. It will be published once a validator validates it.", "Ce défi est en attente de modération. Il sera publié dès qu'un modérateur l'aura validé.")
                            }
                            C.style.fontWeight = "bold", v.appendChild(C)
                        }
                        if (g.appendChild(v), (v = document.createElement("td")).style.padding = iScreenScale + " " + iScreenScale + "px", v.style.width = 12 * iScreenScale + "px", v.style.textAlign = "center", f.succeeded) {
                            var M = document.createElement("div");
                            M.innerHTML = '<span style="color:#CFC;display:inline-block;margin-right:2px">✔</span>' + toLanguage("Completed", "Réussi"), M.style.whiteSpace = "nowrap", M.style.fontSize = Math.round(iScreenScale * (language ? 2 : 2.2)) + "px", M.style.backgroundColor = "#33A033", M.style.display = "inline-block", M.style.padding = "0px " + Math.round(.8 * iScreenScale) + "px", M.style.borderRadius = Math.round(.6 * iScreenScale) + "px", M.style.color = "white", M.style.marginBottom = Math.round(.5 * iScreenScale) + "px", M.style.marginTop = Math.round(.5 * iScreenScale) + "px", v.appendChild(M)
                        }
                        var x = document.createElement("div"),
                            P = document.createElement("img");
                        if (P.src = "images/challenges/difficulty" + f.difficulty.level + ".png", P.alt = "D", P.style.width = 2 * iScreenScale + "px", x.appendChild(P), (k = document.createElement("span")).style.color = f.difficulty.color, k.style.fontSize = Math.round(1.7 * iScreenScale) + "px", k.style.position = "relative", k.style.top = "-1px", k.innerHTML = " " + f.difficulty.name, x.appendChild(k), v.appendChild(x), f.winners.length) {
                            (x = document.createElement("div")).style.cursor = "help";
                            var k, E = document.createElement("img");
                            f.succeeded || (x.style.marginBottom = Math.round(.5 * iScreenScale) + "px"), E.src = "images/cups/cup1.png", E.alt = "W", E.style.width = 2 * iScreenScale + "px", x.appendChild(E), (k = document.createElement("span")).style.color = "white", k.style.fontSize = Math.round(1.7 * iScreenScale) + "px", k.style.position = "relative", k.style.top = "-2px", k.innerHTML = " " + f.winners.length;
                            for (var I, T = '<small style="color:#CFC">' + toLanguage("Succeeded by:", "Réussi par :") + "</small>", w = 0; w < f.winners.length; w++) T += '<br /><span style="color:#CFC;display:inline-block;margin-right:2px">✔</span>' + f.winners[w].nick;
                            x.dataset || (x.dataset = {}), x.dataset.title = T, x.appendChild(k), x.onmouseover = function(e) {
                                if (!I) {
                                    (I = document.createElement("div")).className = "ranking_activeplayertitle", I.innerHTML = this.dataset.title, I.style.position = "absolute", I.style.padding = Math.round(iScreenScale / 2) + "px " + iScreenScale + "px", I.style.borderRadius = iScreenScale + "px", I.style.zIndex = 10, I.style.backgroundColor = "rgba(51,160,51, 0.95)", I.style.color = "white", I.style.fontSize = Math.round(1.8 * iScreenScale) + "px", I.style.lineHeight = Math.round(2 * iScreenScale) + "px", I.style.visibility = "hidden", document.body.appendChild(I);
                                    var t = this.getBoundingClientRect();
                                    I.style.left = Math.round(t.left + (this.scrollWidth - I.scrollWidth) / 2) + "px", I.style.top = t.top + this.scrollHeight + 5 + "px", I.style.visibility = "visible"
                                }
                            }, x.onmouseout = function(e) {
                                I && (document.body.removeChild(I), I = void 0)
                            }, v.appendChild(x)
                        }
                        if (!f.succeeded) {
                            var B = document.createElement("input");
                            B.type = "button", B.value = toLanguage("Take up", "Relever"), B.style.width = 11 * iScreenScale + "px", B.style.fontSize = Math.round(2.4 * iScreenScale) + "px", B.dataset || (B.dataset = {}), B.dataset.id = f.id, B.onclick = function() {
                                e.innerHTML = "", oContainers[0].removeChild(e), xhr("challengeTry.php", "challenge=" + this.dataset.id, function(e) {
                                    if (!e) return !1;
                                    try {
                                        e = JSON.parse(e)
                                    } catch (e) {
                                        return !1
                                    }
                                    for (var t in course = "", delete window.selectedPerso, e) window[t] = e[t];
                                    if (course) selectPlayerScreen(0);
                                    else {
                                        selectMainPage();
                                        var a = document.getElementById("select-nbj-1");
                                        a && a.onclick && a.onclick()
                                    }
                                    if (window.selectedPerso) {
                                        var n = document.getElementById("perso-selector-" + window.selectedPerso);
                                        if (n && n.onclick) {
                                            var o = oContainers[0].childNodes[0];
                                            o.dataset || (o.dataset = {}), o.dataset.bypass = !0, n.onclick()
                                        }
                                    }
                                    return !0
                                })
                            }, v.appendChild(B)
                        }
                        g.appendChild(v), s.appendChild(g)
                    }
                }
            o.appendChild(s)
        } else {
            o.style.textAlign = "center", (C = document.createElement("div")).style.fontSize = 3 * iScreenScale + "px", C.style.marginTop = 3 * iScreenScale + "px", C.style.marginBottom = 2 * iScreenScale + "px", C.style.marginLeft = "auto", C.style.marginRight = "auto", C.style.width = 60 * iScreenScale, C.style.color = "white", C.innerHTML = toLanguage("This circuit has no challenges. Create some right now, it's fast and easy!", "Ce circuit ne comporte aucun défi. Créez-en dès maintenant, c'est facile et rapide !"), o.appendChild(C);
            var L = document.createElement("input");
            L.type = "button", L.style.fontSize = 3 * iScreenScale + "px", L.style.paddingLeft = 2 * iScreenScale + "px", L.style.paddingRight = 2 * iScreenScale + "px", L.value = toLanguage("Go to challenge editor", "Accéder à l'éditeur de défis"), L.onclick = function() {
                openChallengeEditor()
            }, o.appendChild(L)
        }
        n.appendChild(o), e.appendChild(n), (i = document.createElement("input")).type = "button", i.value = toLanguage("Back", "Retour"), i.style.fontSize = 2 * iScreenScale + "px", i.style.position = "absolute", i.style.left = 2 * iScreenScale + "px", i.style.top = 35 * iScreenScale + "px", i.onclick = function() {
            e.innerHTML = "", oContainers[0].removeChild(e), selectMainPage()
        }, e.appendChild(i), myCircuit && r && ((i = document.createElement("input")).type = "button", i.value = toLanguage("Edit challenges...", "Gérer les défis..."), i.style.fontSize = 2 * iScreenScale + "px", i.style.position = "absolute", i.style.right = 2 * iScreenScale + "px", i.style.top = 35 * iScreenScale + "px", i.onclick = function() {
            openChallengeEditor()
        }, e.appendChild(i));
        oContainers[0].appendChild(e)
    }

    function searchCourse() {
        var o = document.createElement("div"),
            e = o.style;
        e.width = iWidth * iScreenScale + "px", e.height = iHeight * iScreenScale + "px", e.border = "solid 1px black", e.backgroundColor = "black";
        var t = document.createElement("div");
        t.style.position = "absolute", t.style.left = "0px", t.style.top = 4 * iScreenScale + "px", t.style.width = iScreenScale * iWidth + "px", t.style.fontSize = 4 * iScreenScale + "", t.style.textAlign = "center", t.innerHTML = toLanguage("Searching for other players<br />Please wait...", "Recherche d'autres joueurs<br />Veuillez patienter..."), o.appendChild(t);
        var a = document.createElement("label");
        a.style.position = "absolute", a.style.left = "0px", a.style.top = 15 * iScreenScale - 9 + "px", a.style.width = iScreenScale * iWidth + "px", a.style.textAlign = "center";
        var i = document.createElement("input");
        i.type = "checkbox", i.id = "iAlert", i.style.transform = i.style.WebkitTransform = i.style.MozTransform = "scale(" + iScreenScale / 6 + ") translateY(8%)", i.style.transformOrigin = i.style.WebkitTransformOrigin = i.style.MozTransformOrigin = "bottom right", a.appendChild(i);
        var n = document.createElement("span");
        n.setAttribute("for", "iAlert"), n.style.fontSize = 2 * iScreenScale + "pt", n.style.marginLeft = "5px", n.innerHTML = toLanguage("Notify me when opponents have been found", "M'alerter lorsque des adversaires ont été trouvés"), a.appendChild(n), o.appendChild(a);
        var r = 0,
            l = document.createElement("div");
        l.style.position = "absolute", l.style.left = "0px", l.style.top = 21 * iScreenScale + "px", l.style.width = 41 * iScreenScale * 2 + "px", l.style.height = Math.round(8.5 * iScreenScale) + "px", l.style.overflow = "hidden";
        for (var s = 0; s < 41; s++) {
            var c = document.createElement("img");
            c.src = "images/cLoading.png", c.className = "pixelated", c.style.width = 2 * iScreenScale + "px", c.style.position = "absolute", c.style.left = s * iScreenScale * 2 + "px", c.style.top = "0px", l.appendChild(c)
        }
        o.appendChild(l);
        var u = document.createElement("div");
        u.style.position = "absolute", u.style.left = "0px", u.style.top = Math.round(17.5 * iScreenScale) + "px", u.style.width = iScreenScale * iWidth + "px", u.style.textAlign = "center", u.style.fontSize = 2 * iScreenScale + "px", u.style.color = "#0B0", u.style.display = "none", u.style.backgroundColor = "rgba(0,0,0, 0.7)", u.innerHTML = toLanguage('<span id="nb-active-players" style="color:#0E0"></span> currently online. You\'ll join them as soon as they finish their ' + (isBattle ? "battle" : "race"), '<span id="nb-active-players" style="color:#0E0"></span> actuellement en ligne. Vous les rejoindrez une fois leur partie terminée'), o.appendChild(u);
        var p = 1,
            d = iScreenScale / 2,
            m = "";

        function y() {
            p && (--p || xhr("getCourse.php", m, function(e) {
                if (!e) return !1;
                try {
                    e = JSON.parse(e)
                } catch (e) {
                    return !1
                }
                if (e.found) {
                    var t = i.checked;
                    if (o.innerHTML = "", oContainers[0].removeChild(o), t) {
                        var a = document.createElement("embed");
                        a.src = "musics/mkalert.wav", a.setAttribute("loop", !1), a.setAttribute("autostart", !0), a.style.position = "absolute", a.style.left = "-1000px", a.style.top = "-1000px", document.body.appendChild(a);
                        var n = (new Date).getTime();
                        alert(toLanguage("Opponents have been found !\nGood luck !", "Des adversaires ont été trouvés !\nBonne chance !")), e.time -= Math.round(((new Date).getTime() - n) / 1e3), document.body.removeChild(a)
                    }
                    e.time < 1 && (e.time = 1), document.getElementById("racecountdown").innerHTML = e.time - 5, selectMapScreen(), dRest(), setTimeout(setChat, 1e3)
                } else p = 10, e.nb_players ? (e.nb_players < 2 && (e.nb_players = 2), document.getElementById("nb-active-players").innerHTML = e.nb_players + " " + toLanguage("players", "joueurs"), u.style.display = "block") : u.style.display = "none";
                return !0
            })), --r <= -4 && (r = 0), l.style.left = Math.round(r * d) + "px", setTimeout(y, 100)
        }
        isCup ? isMCups ? m += "mid=" + nid : isSingle ? m += (complete ? "i" : "id") + "=" + nid + (isBattle ? "&battle" : "") : m += (complete ? "c" : "s") + "id=" + nid : isBattle && (m += "battle"), shareLink.key && (m += (m ? "&" : "") + "key=" + shareLink.key), y(), shareLink.key || xhr("sendCourseNotifs.php", null, function(e) {
            return !0
        });
        var h = document.createElement("input");
        h.type = "button", h.value = toLanguage("Back", "Retour"), h.style.fontSize = 2 * iScreenScale + "px", h.style.position = "absolute", h.style.left = 2 * iScreenScale + "px", h.style.top = 35 * iScreenScale + "px", h.onclick = function() {
            y = function() {}, o.innerHTML = "", oContainers[0].removeChild(o), selectPlayerScreen(0)
        }, o.appendChild(h), oContainers[0].appendChild(o), updateMenuMusic(0)
    }

    function chooseRandMap() {
        "MK" == page ? "BB" != course ? choose(Math.ceil(Math.random() * NBCIRCUITS)) : choose(NBCIRCUITS + Math.ceil(8 * Math.random())) : isSingle ? choose(1) : isBattle ? choose(NBCIRCUITS + Math.ceil(8 * Math.random())) : choose(Math.ceil(Math.random() * NBCIRCUITS))
    }

    function selectMapScreen() {
        if (isCup && !isMCups || isBattle && isCup) selectRaceScreen(0);
        else {
            var e = document.createElement("div"),
                t = e.style,
                a = !0;
            t.width = iWidth * iScreenScale + "px", t.height = iHeight * iScreenScale + "px", t.border = "solid 1px black", t.backgroundColor = "black", "BB" != course ? e.appendChild(toTitle(toLanguage("Choose cup", "Choisissez la coupe"), .5)) : e.appendChild(toTitle(toLanguage("Choose stage", "Choisissez une arène"), .5)), (E = document.createElement("input")).type = "button", E.value = toLanguage("Back", "Retour"), E.style.fontSize = 2 * iScreenScale + "px", E.style.position = "absolute", E.style.left = 2 * iScreenScale + "px", E.style.top = isOnline ? 30 * iScreenScale + "px" : 35 * iScreenScale + "px", E.onclick = function() {
                pause && !isOnline ? (removeMenuMusic(!1), quitter()) : (a = !1, e.innerHTML = "", oContainers[0].removeChild(e), isOnline && (document.getElementById("waitrace").style.visibility = "hidden"), chatting = !1, selectGamersScreen())
            };
            var n = document.createElement("div");
            n.style.position = "absolute", n.style.zIndex = 10, n.style.top = Math.round(35.5 * iScreenScale - 6) + "px", n.style.left = 25 * iScreenScale - 5 + "px", n.style.width = 25 * iScreenScale + 6 + "px", n.style.height = Math.round(3.9 * iScreenScale) + "px", n.style.border = "solid 1px white", n.style.color = "white", n.style.backgroundColor = "black", n.style.borderBottom = "none", n.style.textAlign = "center", n.style.display = "none", n.style.flexDirection = "column", n.style.justifyContent = "center";
            var o = document.createElement("div");

            function i(e) {
                document.getElementById("maps") && document.getElementById("maps").alt == e && (e % 4 != 0 ? e++ : e -= 3, document.getElementById("oMapName").innerHTML = lCircuits[e - 1], document.getElementById("maps").alt = e, document.getElementById("maps").src = getMapSelectorSrc(e - 1), setTimeout(function() {
                    i(e)
                }, 1e3))
            }
            o.style.maxHeight = Math.round(3.9 * iScreenScale) + "px", o.style.overflow = "hidden", n.appendChild(o), e.appendChild(n), e.appendChild(E), "GP" != course && oContainers[0].appendChild(e), document.getElementById("dMaps").style.top = 40 * iScreenScale + "px", document.getElementById("dMaps").style.left = 7 + 25 * iScreenScale + "px", document.getElementById("dMaps").style.width = 25 * iScreenScale + "px", document.getElementById("dMaps").style.height = 10 * iScreenScale + "px";
            var r = ["champi", "etoile", "carapace", "carapacebleue", "speciale", "carapacerouge", "banane", "feuille", "megachampi", "eclair", "upchampi", "fireflower", "bobomb", "minichampi", "egg", "iceflower", "plume", "cloudchampi"],
                l = NBCIRCUITS / 4,
                s = 6;
            "BB" == course && (r = ["snes", "gba"], l = 2);
            var c = Math.ceil(l / s);
            s = Math.ceil(l / c);
            var u = Math.round(10.5 / Math.pow(Math.max(l / 5, c, .5), .6)),
                p = 4,
                d = 4 / c,
                m = 38;
            "BB" == course && (u = Math.round(1.5 * u), p = Math.round(2 * p), m -= 3);
            for (var y = 0; y < l; y++) {
                var h = Math.min(s, l - (y - y % s)),
                    g = document.createElement("img");
                g.className = "pixelated", g.src = "images/cups/" + r[y] + ".gif", g.style.width = u * iScreenScale + "px", g.style.height = u * iScreenScale + "px", g.style.cursor = "pointer", g.style.position = "absolute";
                var f = (iWidth + p + 1) / 2 + (y % s - h / 2) * (u + p),
                    S = (d + m) / 2 + (Math.floor(y / s) - c / 2) * (u + d);
                g.style.left = Math.round(f * iScreenScale) + "px", g.style.top = Math.round(S * iScreenScale) + "px", "BB" == course ? g.alt = y + NBCIRCUITS / 4 : g.alt = y;
                var b = iScreenScale;
                if (g.onmouseover = function() {
                        var e = new Image;
                        e.src = getMapSelectorSrc(y), e.alt = 4 * this.alt + 4, e.style.border = "double 4px white", e.style.width = "100%", e.style.height = "100%", e.id = "maps", document.getElementById("dMaps").appendChild(e);
                        var t = mapNameOf(b, 4 * this.alt);
                        if (t.id = "oMapName", document.getElementById("dMaps").appendChild(t), document.getElementById("dMaps").style.display = "block", i(4 * this.alt + 4), cupNames[this.alt]) {
                            o.innerHTML = cupNames[this.alt];
                            var a = Math.min(Math.max(8 / Math.sqrt(stripSpecialChars(cupNames[this.alt]).length), 1.45), 3);
                            n.style.fontSize = Math.round(a * iScreenScale) + "px", n.style.display = "flex"
                        }
                    }, g.onmouseout = function() {
                        document.getElementById("dMaps").style.display = "none", document.getElementById("dMaps").innerHTML = "", n.style.display = "none"
                    }, g.onclick = function() {
                        document.getElementById("dMaps").style.display = "none", document.getElementById("dMaps").innerHTML = "", e.innerHTML = "", oContainers[0].removeChild(e), selectRaceScreen(4 * this.alt)
                    }, "BB" == course) {
                    var v = [toLanguage("SNES Stages", "Arènes SNES"), toLanguage("GBA Stages", "Arènes GBA")],
                        C = document.createElement("div");
                    C.style.position = "absolute", C.style.left = Math.round((f - p / 2) * iScreenScale) + "px", C.style.top = Math.round((S + .9 * u) * iScreenScale) + "px", C.style.width = (u + p) * iScreenScale + "px", C.style.fontSize = 3 * iScreenScale + "px", C.style.color = "white", C.style.textAlign = "center", C.innerHTML = v[y], e.appendChild(C)
                }
                if (e.appendChild(g), "GP" == course) {
                    var M = 1 * ptsGP.charAt(y);
                    if (M) {
                        var x = new Image;
                        x.src = "images/cups/cup" + (4 - M) + ".png", x.style.width = Math.round(4 * iScreenScale * u / 7) + "px", x.style.height = Math.round(4 * iScreenScale * u / 7) + "px", x.style.position = "absolute", x.style.left = Math.round((f + 4 * u / 7) * iScreenScale) + "px", x.style.top = Math.round((S + 4 * u / 7) * iScreenScale) + "px", x.className = "pixelated", e.appendChild(x)
                    }
                } else if (isMCups && !isOnline) {
                    var P = document.createElement("a");
                    P.style.position = "absolute", P.style.left = Math.round((f + 5 * u / 7) * iScreenScale) + "px", P.style.top = Math.round((S + 5 * u / 7) * iScreenScale) + "px", P.style.backgroundColor = "rgba(0,50,128, 0.5)", P.style.padding = "4px", P.style.borderRadius = "50%";
                    oMaps[aAvailableMaps[y]];
                    P.href = "?cid=" + cupIDs[y], P.title = toLanguage("Link to this cup", "Lien vers cette coupe"), P.onmouseover = function() {
                        this.style.backgroundColor = "rgba(0,102,153, 0.8)"
                    }, P.onmouseout = function() {
                        this.style.backgroundColor = "rgba(0,50,128, 0.5)"
                    };
                    var k = document.createElement("img");
                    k.src = "images/clink.png", k.style.width = Math.round(u * iScreenScale * 2 / 7) + "px", P.appendChild(k), e.appendChild(P)
                }
            }
            if ("VS" == course || "BB" == course)(E = document.createElement("input")).type = "button", E.value = toLanguage("Random", "Aléatoire"), E.style.fontSize = 3 * iScreenScale + "px", E.style.position = "absolute", E.style.left = 34 * iScreenScale - 10 + "px", E.style.top = 30 * iScreenScale + "px", E.onclick = function() {
                a = !1, e.innerHTML = "", oContainers[0].removeChild(e), chooseRandMap()
            }, e.appendChild(E);
            else if ("GP" == course) oContainers[0].appendChild(e);
            else if ("CM" == course) {
                var E;
                (E = document.createElement("input")).type = "button", E.value = toLanguage("Ranking", "Classement"), E.style.fontSize = 3 * iScreenScale + "px", E.style.position = "absolute", E.style.left = 33 * iScreenScale - 10 + "px", E.style.top = 30 * iScreenScale + "px", E.onclick = openRankings, e.appendChild(E)
            }
            isOnline && setTimeout(function() {
                a && (document.getElementById("dMaps").style.display = "none", document.getElementById("dMaps").innerHTML = "", e.innerHTML = "", oContainers[0].removeChild(e), chooseRandMap())
            }, 1e3 * document.getElementById("racecountdown").innerHTML)
        }
        isOnline && (setSRest(), document.getElementById("waitrace").style.visibility = "visible"), updateMenuMusic(1)
    }

    function setMapSrc(e, t, a, n) {
        isCup ? setTimeout(function() {
            e.src = n
        }, 100 * (a - t)) : e.src = n
    }

    function rankingsLink(e) {
        switch (page) {
            case "MK":
                return "classement.php?map=" + encodeURIComponent(sCircuits[e.map - 1]);
            case "CI":
                return "classement.php?circuit=" + e.id;
            case "MA":
                return "classement.php?draw=" + e.map
        }
    }

    function openRankings() {
        if (isMCups) open("classement.php?mcup=" + nid);
        else switch (page) {
            case "MK":
                open("classement.php");
                break;
            case "CI":
                open("classement.php" + (isSingle ? "?circuit=" + nid : "?scup=" + nid));
                break;
            case "MA":
                open("classement.php" + (isSingle ? "?draw=" + nid : "?ccup=" + nid))
        }
    }

    function exitCircuit() {
        var e = document.getElementById("changeRace"),
            t = document.getElementById("supprRace");
        e && !t ? e.click() : document.location.href = "index.php"
    }

    function appendContainers() {
        for (var e = 1; e < oContainers.length; e++) document.getElementById("mariokartcontainer").appendChild(oContainers[e])
    }

    function selectRaceScreen(cup) {
        if (isOnline || !isSingle && "GP" != course) {
            var oScr = document.createElement("div"),
                oStyle = oScr.style,
                forceClic4 = !0;
            oStyle.width = iWidth * iScreenScale + "px", oStyle.height = iHeight * iScreenScale + "px", oStyle.border = "solid 1px black", oStyle.backgroundColor = "black", oContainers[0].appendChild(oScr), "BB" != course ? oScr.appendChild(toTitle(toLanguage("Choose track", "Choisissez un circuit"), isSingle ? 2.5 : .5)) : oScr.appendChild(toTitle(toLanguage("Choose stage", "Choisissez une arène"), isSingle ? 2.5 : .5));
            var oPInput = document.createElement("input");
            oPInput.type = "button", oPInput.value = toLanguage("Back", "Retour"), oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 2 * iScreenScale + "px", oPInput.style.top = isOnline ? 30 * iScreenScale + "px" : 35 * iScreenScale + "px", oPInput.onclick = function() {
                forceClic4 = !1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), isOnline && isCup && !isMCups ? (document.getElementById("waitrace").style.visibility = "hidden", chatting = !1, selectPlayerScreen(0)) : "BB" != course ? isCup && !isMCups ? pause ? (removeMenuMusic(!1), quitter()) : selectGamersScreen() : selectMapScreen() : isCup ? pause ? (removeMenuMusic(!1), quitter()) : selectGamersScreen() : selectMapScreen()
            }, oScr.appendChild(oPInput);
            for (var mScreenScale = iScreenScale, lCup = isSingle ? cup + 1 : cup + 4, i = cup; i < lCup; i++) {
                var mDiv = document.createElement("div");
                mDiv.style.width = 25 * iScreenScale + "px", mDiv.style.height = 10 * iScreenScale + "px", mDiv.style.cursor = "pointer", mDiv.style.position = "absolute";
                var j = i - cup;
                isSingle ? (mDiv.style.left = 27 * iScreenScale + "px", mDiv.style.top = 15 * iScreenScale + "px") : (mDiv.style.left = ((iWidth - 113) / 2 + 25 * (j - 2 * Math.floor(j / 2)) + (j - 2 * Math.floor(j / 2))) * iScreenScale + 30 * iScreenScale + "px", mDiv.style.top = 10 * iScreenScale + 11 * iScreenScale * Math.floor(j / 2) + "px"), mDiv.map = aAvailableMaps[i], mDiv.ref = i + 1;
                var oPImg = new Image;
                if (setMapSrc(oPImg, cup, i, getMapSelectorSrc(i)), oPImg.style.width = "100%", oPImg.style.height = "100%", oPImg.style.border = "double 4px silver", oPImg.className = "pixelated", mDiv.appendChild(oPImg), mDiv.appendChild(mapNameOf(mScreenScale, i)), isCup && !isOnline) {
                    var mLink = document.createElement("a");
                    mLink.style.position = "absolute", mLink.style.right = "-3px", mLink.style.top = "5px", mLink.style.backgroundColor = "rgba(0,50,128, 0.5)", mLink.style.padding = "4px", mLink.style.borderRadius = "50%";
                    var iMap = oMaps[aAvailableMaps[i]];
                    mLink.href = "MA" == page ? "?i=" + iMap.map : "?id=" + iMap.id, mLink.title = toLanguage("Link to this circuit", "Lien vers ce circuit"), mLink.onclick = function(e) {
                        e.stopPropagation()
                    }, mLink.onmouseover = function() {
                        this.style.backgroundColor = "rgba(0,102,153, 0.8)"
                    }, mLink.onmouseout = function() {
                        this.style.backgroundColor = "rgba(0,50,128, 0.5)"
                    };
                    var iLink = document.createElement("img");
                    iLink.src = "images/clink.png", iLink.style.width = 2 * iScreenScale + "px", mLink.appendChild(iLink), mDiv.appendChild(mLink)
                }
                mDiv.onclick = function() {
                    if (forceClic4 = !1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), isOnline) choose(this.ref);
                    else if ("CM" != course) appendContainers(), resetGame(this.map);
                    else if ("MK" != page) gPersos.length = 0, resetGame(this.map);
                    else {
                        document.body.style.cursor = "progress";
                        var tMap = this.map,
                            iMap = tMap.replace(/^[a-zA-Z]+([0-9]+)$/, "$1");
                        xhr("ghostsave.php", "map=" + iMap, function(reponse) {
                            var ghostSaves;
                            try {
                                ghostSaves = eval(reponse)
                            } catch (e) {
                                return !1
                            }
                            return selectFantomeScreen(void 0, iMap - 1), !0
                        })
                    }
                }, oScr.appendChild(mDiv)
            }
            if (isCup && !isSingle && !isMCups) {
                var oPInput = document.createElement("input");
                oPInput.type = "button", "CM" != course ? oPInput.value = toLanguage("Random", "Aléatoire") : oPInput.value = toLanguage("Rankings", "Classement"), oPInput.style.position = "absolute", isOnline ? (oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.left = 67 * iScreenScale + "px", oPInput.style.top = 30 * iScreenScale + "px") : (oPInput.style.fontSize = 3 * iScreenScale + "px", oPInput.style.left = 34 * iScreenScale - 10 + "px", oPInput.style.top = 34 * iScreenScale + "px"), oPInput.onclick = function() {
                    "CM" != course ? (forceClic4 = !1, oScr.innerHTML = "", oContainers[0].removeChild(oScr), chooseRandMap()) : openRankings()
                }, oScr.appendChild(oPInput)
            }
            isOnline && (setSRest(), setTimeout(function() {
                forceClic4 && (oScr.innerHTML = "", oContainers[0].removeChild(oScr), chooseRandMap())
            }, 1e3 * document.getElementById("racecountdown").innerHTML))
        } else "GP" == course && (iDificulty = "MK" != page || cup ? 5 : 4.5), cup++, strMap = "map" + cup, appendContainers(), resetGame(strMap);
        updateMenuMusic(1)
    }

    function choose(map) {
        if (!isOnline) return appendContainers(), void resetGame("map" + map);
        var choixJoueurs = [],
            oTable = document.createElement("table");
        oTable.border = 1, oTable.setAttribute("cellspacing", 2), oTable.setAttribute("cellpadding", 2), oTable.style.position = "absolute", oTable.style.fontSize = 2 * iScreenScale + "pt", oTable.style.textAlign = "center", oTable.style.left = 25 * iScreenScale + "px", oTable.style.top = 2 * iScreenScale + "px", oTable.style.width = 30 * iScreenScale + "px";
        var oTBody = document.createElement("tbody");

        function refreshTab(reponse) {
            if (reponse) {
                if (-1 != reponse) {
                    var rCode;
                    try {
                        rCode = eval(reponse)
                    } catch (e) {
                        return !1
                    }
                    choixJoueurs = rCode[0];
                    for (var trs = oTBody.getElementsByTagName("tr"); trs.length;) oTBody.removeChild(trs[0]);
                    for (i = 0; i < choixJoueurs.length; i++) {
                        var oTr = document.createElement("tr"),
                            oTd = document.createElement("td"),
                            isChoix = choixJoueurs[i][2];
                        oTd.innerHTML = isChoix ? lCircuits[isChoix - 1] : toLanguage("Not choosen", "Non choisi"), oTr.appendChild(oTd), oTBody.appendChild(oTr)
                    }
                    if (-1 == rCode[1]) setTimeout(waitForChoice, 1e3);
                    else if (1 < choixJoueurs.length) {
                        for (aPlayers = new Array, aIDs = new Array, aPlaces = new Array, aPseudos = new Array, aTeams = new Array, i = 0; i < choixJoueurs.length; i++) {
                            var aID = choixJoueurs[i][0];
                            aID != identifiant ? (aIDs.push(aID), aPlayers.push(choixJoueurs[i][1]), isCustomPerso(choixJoueurs[i][1]), aPlaces.push(choixJoueurs[i][3]), aPseudos.push(choixJoueurs[i][4]), aTeams.push(choixJoueurs[i][5])) : (aPlaces.unshift(choixJoueurs[i][3]), aPseudos.unshift(choixJoueurs[i][4]), aTeams.unshift(choixJoueurs[i][5]))
                        }
                        selectedTeams = -1 == aTeams.indexOf(-1), selectedTeams || (aTeams.length = 0), tnCourse = (new Date).getTime() + rCode[2], isSingle ? rCode[2] = 0 : rCode[4].manualTeams ? playerIsSelecter() ? rCode[2] = 0 : rCode[2] -= 12e3 : tnCourse += 5e3, connecte = rCode[3] + 1;
                        var cCursor = 0,
                            cTime = 50;

                        function moveCursor() {
                            var e = !0;
                            if (cCursor == rCode[1]) {
                                for (var t = 0, a = cTime, n = 0; n < choixJoueurs.length; n++) t += a = Math.round(1.05 * a);
                                t >= rCode[2] && (e = !1)
                            }
                            e ? (trs[cCursor].style.backgroundColor = "", trs[cCursor].style.color = "", ++cCursor == choixJoueurs.length && (cCursor = 0), trs[cCursor].style.backgroundColor = "#F80", trs[cCursor].style.color = "white", cTime = Math.round(1.05 * cTime), rCode[2] -= cTime, setTimeout(moveCursor, cTime)) : clignote(0)
                        }

                        function clignote(e) {
                            trs[cCursor].style.backgroundColor = e % 2 ? "" : "#F80", trs[cCursor].style.color = e % 2 ? "" : "white", e < 4 ? setTimeout(function() {
                                clignote(e + 1)
                            }, 100) : setTimeout(function() {
                                document.body.removeChild(oTable), proceedOnlineRaceSelection(rCode)
                            }, 500)
                        }
                        moveCursor(), oMap = oMaps[aAvailableMaps[choixJoueurs[rCode[1]][2] - 1]]
                    } else {
                        var oDiv = document.createElement("div");
                        oDiv.style.position = "absolute", oDiv.style.left = 10 * iScreenScale + 10 + "px", oDiv.style.top = 20 * iScreenScale + 10 + "px", oDiv.style.fontSize = 2 * iScreenScale + "pt", oDiv.innerHTML = toLanguage("Sorry, all your opponents have left the race...", "D&eacute;sol&eacute;, tous vos adversaires ont quitt&eacute; la course..."), oDiv.appendChild(document.createElement("br"));
                        var nSearch = document.createElement("a");
                        nSearch.style.color = "white", nSearch.innerHTML = toLanguage("Search for new players", "Rechercher de nouveaux joueurs"), nSearch.setAttribute("href", "#null"), nSearch.onclick = function() {
                            return document.body.removeChild(oTable), document.body.removeChild(oDiv), removeMenuMusic(), removeGameMusics(), formulaire.screenscale.disabled = !1, formulaire.quality.disabled = !1, formulaire.music.disabled = !1, formulaire.sfx.disabled = !1, searchCourse(), !1
                        }, oDiv.appendChild(nSearch), oDiv.appendChild(document.createElement("br"));
                        var nSearch = document.createElement("a");
                        nSearch.style.color = "white", nSearch.innerHTML = toLanguage("Back to Mario Kart PC", "Retour à Mario Kart PC"), nSearch.setAttribute("href", "index.php"), oDiv.appendChild(nSearch), document.body.appendChild(oDiv), chatting = !1, clearInterval(startMusicHandler)
                    }
                } else iDeco();
                return !0
            }
            return !1
        }

        function playerIsSelecter() {
            for (var e, t = 0; t < choixJoueurs.length; t++)
                if (choixJoueurs[t][0] == shareLink.player) {
                    e = choixJoueurs[t];
                    break
                } return (e = e || choixJoueurs[0])[0] == identifiant
        }

        function proceedOnlineRaceSelection(e) {
            var t = e[4],
                a = aAvailableMaps[choixJoueurs[e[1]][2] - 1];
            t.manualTeams ? selectOnlineTeams(a, choixJoueurs, playerIsSelecter()) : resetGame(a)
        }

        function waitForChoice() {
            xhr("getMap.php", "BB" == course ? "battle" : "", refreshTab)
        }
        xhr("chooseMap.php", "joueur=" + strPlayer + "&map=" + map + ("BB" == course ? "&battle" : ""), refreshTab), oTable.appendChild(oTBody), document.body.appendChild(oTable), document.getElementById("waitrace").style.visibility = "hidden", updateMenuMusic(1), formulaire.screenscale.disabled = !0, formulaire.quality.disabled = !0, formulaire.music.disabled = !0, formulaire.sfx.disabled = !0, bMusic && (startMusicHandler = setInterval(function() {
            oMapImg && (loadMapMusic(), clearInterval(startMusicHandler))
        }, 500))
    }

    function selectOnlineTeams(c, e, t) {
        var y = document.createElement("div"),
            a = y.style;
        a.width = iWidth * iScreenScale + "px", a.height = iHeight * iScreenScale + "px", a.border = "solid 1px black", a.backgroundColor = "black";
        var n = toTitle(toLanguage("Team selection", "Sélection des équipes"), .5);
        n.style.fontSize = Math.round(7 * iScreenScale) + "px", y.appendChild(n);
        var u = document.createElement("div");
        u.style.display = "none", u.style.position = "absolute", u.style.zIndex = 5e4, u.style.left = iScreenScale + "px", u.style.top = 10 * iScreenScale + "px", u.style.width = (iWidth - 2) * iScreenScale + "px", u.style.textAlign = "center";
        var h = document.createElement("table");
        h.style.marginLeft = "auto", h.style.marginRight = "auto", h.style.fontSize = Math.round(2.4 * iScreenScale) + "px";
        var p = document.createElement("div");
        p.style.zIndex = 50002, p.style.display = "none", p.style.position = "absolute", p.style.right = 3 * iScreenScale + "px", p.style.bottom = 5 * iScreenScale + "px";
        var o = document.createElement("input");
        o.type = "button", o.style.display = "block", o.style.marginTop = Math.round(iScreenScale / 2) + "px", o.value = toLanguage("No teams", "Chacun pour soi"), o.style.fontSize = 2 * iScreenScale + "px", o.style.width = 18 * iScreenScale + "px", o.style.textAlign = "center", o.onclick = function() {
            r(toLanguage("No teams?", "Jouer sans équipes ?"), toLanguage("Please confirm that you want to play without teams", "Confirmez que vous souhaitez jouer en mode <em>chacun pour soi</em>."), function() {
                clearTimeout(b);
                var e = "noteams";
                isBattle && (e += "&battle"), isSingle && (e += "&single"), m(), xhr("chooseTeams.php", e, function(e) {
                    if (!e) return !1;
                    var t;
                    try {
                        t = JSON.parse(e)
                    } catch (e) {
                        return !1
                    }
                    return l(t), !0
                })
            })
        }, p.appendChild(o);
        var i = document.createElement("input");

        function r(e, t, a) {
            var n = document.createElement("div");
            n.id = "online-teams-confirm", n.style.position = "absolute", n.style.left = 0, n.style.top = 0, n.style.width = iWidth * iScreenScale + "px", n.style.height = iHeight * iScreenScale + "px", n.style.backgroundColor = "rgba(0,0,0, 0.5)", n.style.zIndex = 6e4;
            var o = document.createElement("div");
            o.style.position = "absolute", o.style.zIndex = 6e4, o.style.left = Math.round(iScreenScale * iWidth / 2) + "px", o.style.top = Math.round(iScreenScale * iHeight / 2) + "px", o.style.width = 40 * iScreenScale + "px", o.style.transform = o.style.WebkitTransform = o.style.MozTransform = "translate(-50%, -50%)", o.style.backgroundColor = "gray", o.style.border = "solid 1px silver", o.onclick = function(e) {
                e.stopPropagation()
            };
            var i = document.createElement("div");
            i.style.marginTop = iScreenScale + "px", i.style.marginBottom = Math.round(iScreenScale / 2) + "px", i.style.fontSize = Math.round(2.5 * iScreenScale) + "px", i.style.textAlign = "center", i.style.marginLeft = 2 * iScreenScale + "px", i.style.marginRight = 2 * iScreenScale + "px", i.style.color = "#FE9", i.innerHTML = e, o.appendChild(i);
            var r = document.createElement("div");
            r.style.marginBottom = iScreenScale + "px", r.style.textAlign = "center", r.style.marginLeft = Math.round(1.5 * iScreenScale) + "px", r.style.marginRight = Math.round(1.5 * iScreenScale) + "px", r.style.fontSize = Math.round(1.8 * iScreenScale) + "px", r.style.color = "white", r.innerHTML = t, o.appendChild(r);
            var l = document.createElement("div");
            l.style.textAlign = "center", l.style.marginBottom = iScreenScale + "px";
            var s = document.createElement("input");
            s.type = "button", s.style.marginRight = Math.round(iScreenScale / 2) + "px", s.value = "Ok", s.style.fontSize = Math.round(2 * iScreenScale) + "px", s.onclick = function() {
                return y.removeChild(n), a(), !1
            }, l.appendChild(s);
            var c = document.createElement("input");
            return c.type = "button", c.value = toLanguage("Cancel", "Annuler"), c.style.marginLeft = Math.round(iScreenScale / 2) + "px", c.style.fontSize = Math.round(2 * iScreenScale) + "px", c.onclick = n.onclick = function() {
                return y.removeChild(n), !1
            }, l.appendChild(c), o.appendChild(l), n.appendChild(o), y.appendChild(n), setTimeout(function() {
                s.focus()
            }, 1), n
        }

        function g(e) {
            h.innerHTML = "";
            for (var t = Math.max(f[0].length, f[1].length), a = 0; a < t; a++) {
                for (var n = document.createElement("tr"), o = 0; o < 2; o++) {
                    var i = document.createElement("td"),
                        r = f[o][a];
                    if (r) {
                        selectedTeams ? (i.style.backgroundColor = o ? "#fba" : "#abf", i.style.color = o ? "red" : "blue") : (i.style.backgroundColor = "#ccc", i.style.color = "#222"), i.style.position = "relative", i.style.textAlign = "center", i.style.userSelect = "none";
                        var l = document.createElement("span");
                        if (l.style.display = "block", l.style.top = "1px", l.style.position = "relative", l.innerHTML = r[4], l.style.whiteSpace = "nowrap", l.style.textOverflow = "ellipsis", l.style.overflow = "hidden", l.style.width = 16 * iScreenScale + "px", i.appendChild(l), e) {
                            var s = document.createElement("span");
                            s.innerHTML = o ? "◀" : "▶", s.style.position = "absolute", o ? (s.style.left = "0px", i.style.paddingLeft = 3 * iScreenScale + "px", i.style.paddingRight = iScreenScale + "px") : (s.style.right = "0px", i.style.paddingRight = 3 * iScreenScale + "px", i.style.paddingLeft = iScreenScale + "px"), s.style.top = "48%", s.style.color = "#F80", s.style.padding = Math.round(iScreenScale / 2) + "px", s.style.transform = s.style.WebkitTransform = s.style.MozTransform = "translateY(-50%)", s.style.cursor = "pointer", s.style.opacity = .9, s.onmouseover = function() {
                                this.style.opacity = .45
                            }, s.onmouseout = function() {
                                this.style.opacity = .9
                            }, s.dataset || (s.dataset = {}), s.dataset.i = a, s.dataset.j = o, s.onclick = d, i.appendChild(s)
                        }
                    } else i.innerHTML = "&nbsp;", i.style.width = 20 * iScreenScale + "px";
                    n.appendChild(i)
                }
                h.appendChild(n)
            }
            f[0].length && f[1].length ? (C.style.opacity = 1, C.disabled = !1, C.style.cursor = "") : (C.style.opacity = .4, C.disabled = !0, C.style.cursor = "not-allowed")
        }

        function d() {
            var u = document.createElement("div");
            u.style.position = "absolute", u.style.left = "0px", u.style.top = "0px", u.style.width = iScreenScale * iWidth + "px", u.style.height = iScreenScale * iWidth + "px", u.style.zIndex = 5e4, y.appendChild(u);
            var p = +this.dataset.i,
                d = +this.dataset.j,
                e = f[d][p];
            f[d].splice(p, 1), f[1 - d].splice(Math.min(p, f[1 - d].length), 0, e);
            var m = this.parentNode;
            m.style.backgroundColor = "#ccc",
                function e(t, a, n) {
                    var o = t;
                    if (a < (t += n)) y.removeChild(u), g(!0);
                    else {
                        m.style.left = Math.round(20 * iScreenScale * t / a * (d ? -1 : 1)) + "px";
                        var i = a / 2;
                        o < i && i <= t && (m.style.backgroundColor = d ? "#abf" : "#fba", m.style.color = d ? "blue" : "red");
                        for (var r = h.getElementsByTagName("tr"), l = 0; l < 2; l++)
                            for (var s = l == d, c = s ? p + 1 : p; c < r.length; c++) r[c].getElementsByTagName("td")[l].style.top = Math.round(3 * iScreenScale * t / a * (s ? -1 : 1)) + "px";
                        v = setTimeout(function() {
                            e(t, a, n)
                        }, n)
                    }
                }(0, 150, 20)
        }

        function l(e) {
            tnCourse = (new Date).getTime() + e.time;
            for (var t = e.teams, a = {}, n = 0; n < 2; n++)
                for (var o = 0; o < f[n].length; o++) a[f[n][o][0]] = f[n][o];
            for (n = 0; n < t.length; n++) a[t[n].id][5] = t[n].team;
            for (n = 0; n < strPlayer.length; n++) aTeams[n] = a[identifiant][5];
            for (n = 0; n < aPlayers.length; n++) {
                var i = aIDs[n],
                    r = n + strPlayer.length;
                aTeams[r] = a[i][5]
            }
            if (selectedTeams = -1 == aTeams.indexOf(-1), f[0].length = 0, f[1].length = 0, selectedTeams)
                for (n = 0; n < t.length; n++) f[t[n].team].push(a[t[n].id]);
            else
                for (n = 0; n < t.length; n++) f[n % 2].push(a[t[n].id]);
            g(!1), u.removeChild(C), y.removeChild(p);
            var l = document.createElement("div");
            l.style.textAlign = "center", l.style.fontSize = 3 * iScreenScale + "px", l.style.marginTop = iScreenScale + "px", l.style.color = "#DFC", l.innerHTML = selectedTeams ? toLanguage("Teams have been selected !", "Les équipes ont été sélectionnées !") : toLanguage("Mode &quot;no teams&quot; selected. In this game, you're playing for yourself!", "Mode &quot;Chacun pour soi&quot; sélectionné. Cette partie se déroulera sans équipes"), u.appendChild(l), u.style.display = "block";
            var s = tnCourse - (new Date).getTime();
            setTimeout(function() {
                y.innerHTML = "", oContainers[0].removeChild(y), resetGame(c)
            }, Math.min(2e3, s - 1e3))
        }

        function s() {
            oContainers[0].removeChild(y), y.innerHTML = "";
            var e, t = document.createElement("div");
            t.style.position = "absolute", t.style.left = 10 * iScreenScale + 10 + "px", t.style.top = 15 * iScreenScale + 10 + "px", t.style.fontSize = 2 * iScreenScale + "pt", t.innerHTML = toLanguage("The game has been cancelled by the teams selector.", "Partie annulée par le sélectionneur des équipes."), t.appendChild(document.createElement("br")), (e = document.createElement("a")).style.color = "white", e.innerHTML = toLanguage("Search for new players", "Rechercher de nouveaux joueurs"), e.setAttribute("href", "#null"), e.onclick = function() {
                return document.body.removeChild(t), removeMenuMusic(), removeGameMusics(), formulaire.screenscale.disabled = !1, formulaire.quality.disabled = !1, formulaire.music.disabled = !1, formulaire.sfx.disabled = !1, chatting = !1, searchCourse(), !1
            }, t.appendChild(e), t.appendChild(document.createElement("br")), (e = document.createElement("a")).style.color = "white", e.innerHTML = toLanguage("Back to Mario Kart PC", "Retour à Mario Kart PC"), e.setAttribute("href", "index.php"), t.appendChild(e), document.body.appendChild(t), clearInterval(startMusicHandler)
        }

        function m() {
            u.style.display = "none", p.style.display = "none";
            var e = document.getElementById("online-teams-confirm");
            e && y.removeChild(e), document.getElementById("waitteam").style.visibility = "hidden"
        }
        i.type = "button", i.style.display = "block", i.style.marginTop = Math.round(iScreenScale / 2) + "px", i.value = toLanguage("Cancel game", "Annuler la partie"), i.style.fontSize = 2 * iScreenScale + "px", i.style.width = 18 * iScreenScale + "px", i.style.color = "#F60", i.style.textAlign = "center", i.onclick = function() {
            r(toLanguage("Cancel game?", "Annuler la partie ?"), toLanguage("Caution, you're about to cancel the game <strong style=\"color:#FEB\">for all players</strong>. Use this option if you're waiting for more players for example.", 'Attention, vous êtes sur le point d\'annuler la partie <strong style="color:#FEB">pour tous les joueurs</strong>. Utilisez cette option si vous attendez plus de joueurs par exemple.'), function() {
                clearTimeout(b);
                var e = "cancel";
                isBattle && (e += "&battle"), m(), xhr("chooseTeams.php", e, function(e) {
                    if (!e) return !1;
                    try {
                        JSON.parse(e)
                    } catch (e) {
                        return !1
                    }
                    return s(), !0
                })
            })
        }, p.appendChild(i), y.appendChild(p);
        for (var f = [
                [],
                []
            ], S = 0; S < e.length; S++) f[e[S][5]].push(e[S]);
        var b, v, C = document.createElement("input");
        C.type = "button", C.style.fontSize = 3 * iScreenScale + "px", C.style.marginTop = iScreenScale + "px", C.value = toLanguage("Validate", "Valider"), C.onclick = function() {
            clearTimeout(b);
            for (var e = "", t = 0, a = 0; a < 2; a++)
                for (var n = 0; n < f[a].length; n++) t && (e += "&"), e += "j" + f[a][n][0] + "=" + a, t++;
            isBattle && (e += "&battle"), isSingle && (e += "&single"), m(), xhr("chooseTeams.php", e, function(e) {
                if (!e) return !1;
                var t;
                try {
                    t = JSON.parse(e)
                } catch (e) {
                    return !1
                }
                return l(t), !0
            })
        }, u.appendChild(h), u.appendChild(C), y.appendChild(u);
        var M = (new Date).getTime(),
            x = tnCourse - M - 2e3;
        if (t) document.getElementById("teamcountdown").innerHTML = Math.round(x / 1e3), setSRest("team"), document.getElementById("waitteam").style.visibility = "visible", dRest("team"), b = setTimeout(function() {
            clearTimeout(v);
            var e = "";
            isBattle && (e = "battle"), m(), xhr("chooseTeams.php", e, function(e) {
                if (!e) return !1;
                var t;
                try {
                    t = JSON.parse(e)
                } catch (e) {
                    return !1
                }
                return l(t), !0
            })
        }, 1e3 * document.getElementById("teamcountdown").innerHTML), g(!0), u.style.display = "block", p.style.display = "block";
        else {
            y.style.visibility = "hidden";
            var P = document.createElement("div");
            P.style.position = "absolute", P.style.left = 6 * iScreenScale + "px", P.style.top = 12 * iScreenScale + "px", P.style.fontSize = Math.round(2.5 * iScreenScale) + "px", P.style.color = "#DFC", P.innerHTML = language ? "Teams are being selected... Please don't exit game" : "Les équipes sont cours de sélection... Ne pas quitter la partie.", y.appendChild(P);
            var k = 41,
                E = document.createElement("div");
            E.style.position = "absolute", E.style.left = "0px", E.style.top = 19 * iScreenScale + "px", E.style.width = iScreenScale * k * 2 + "px", E.style.height = Math.round(8.5 * iScreenScale) + "px", E.style.overflow = "hidden";
            for (S = 0; S < k; S++) {
                var I = document.createElement("img");
                I.src = "images/cLoading.png", I.className = "pixelated", I.style.width = 2 * iScreenScale + "px", I.style.position = "absolute", I.style.left = S * iScreenScale * 2 + "px", I.style.top = "0px", I.style.opacity = .5, E.appendChild(I)
            }
            y.appendChild(E);
            var T = 0;
            ! function a() {
                xhr("getTeams.php", "", function(e) {
                    if (y.style.visibility = "", !e) return !1;
                    var t;
                    try {
                        t = JSON.parse(e)
                    } catch (e) {
                        return !1
                    }
                    switch (t.state) {
                        case "selecting_teams":
                            ! function() {
                                for (var e = E.getElementsByTagName("img"), t = (new Date).getTime(), a = Math.round(k * Math.min((t - M) / x, 1)); T < a;) e[T].style.opacity = 1, T++
                            }(), setTimeout(a, 1e3);
                            break;
                        case "teams_selected":
                            y.removeChild(P), y.removeChild(E), l(t);
                            break;
                        default:
                            y.removeChild(P), y.removeChild(E), s()
                    }
                    return !0
                })
            }()
        }
        oContainers[0].appendChild(y)
    }

    function iDeco() {
        var e = document.createElement("div");
        e.style.position = "absolute", e.style.left = 15 * iScreenScale + "px", e.style.top = 8 * iScreenScale + "px", e.style.width = 50 * iScreenScale + "px", e.style.height = 15 * iScreenScale + "px", e.style.fontSize = 3 * iScreenScale + "px", e.style.backgroundColor = "gray", e.style.color = "white", e.style.border = "solid 1px silver", e.style.fontWeight = "bold", e.style.textAlign = "center", e.style.paddingTop = 5 * iScreenScale + "px", e.style.zIndex = 2e4, e.innerHTML = toLanguage("You have been disconnected", "Vous avez &eacute;t&eacute; d&eacute;connect&eacute;");
        for (var t = 0; t < 2; t++) e.appendChild(document.createElement("br"));
        var a = document.createElement("input");
        a.type = "button", a.value = toLanguage("Back", "Retour"), a.style.fontSize = 3 * iScreenScale + "px", a.onclick = function() {
            location.reload()
        }, e.appendChild(a), oContainers[0].appendChild(e), chatting = !1
    }

    function dRest(e) {
        if (e = e || "race", isOnline) {
            var t = document.getElementById(e + "countdown").innerHTML - 1;
            (document.getElementById(e + "countdown").innerHTML = t) && "visible" == document.getElementById("wait" + e).style.visibility && setTimeout(function() {
                dRest(e)
            }, 1e3)
        }
    }

    function setSRest(e) {
        e = e || "race", isOnline && (document.getElementById("wait" + e).style.left = 2 * iScreenScale + 10 + "px", document.getElementById("wait" + e).style.top = 35 * iScreenScale + 10 + "px", document.getElementById("wait" + e).style.minWidth = iScreenScale * (iWidth - 4) + "px", document.getElementById("wait" + e).style.fontSize = 3 * iScreenScale + "px")
    }

    function connexion() {
        var a, n, o, i = document.createElement("div"),
            e = i.style;
        e.width = iWidth * iScreenScale + "px", e.height = iHeight * iScreenScale + "px", e.border = "solid 1px black", e.backgroundColor = "black", i.appendChild(toTitle(toLanguage("Connection", "Connexion"), -.5));
        var t = document.createElement("form");
        t.style.position = "absolute", t.style.left = 16 * iScreenScale + "px", t.style.top = 10 * iScreenScale + "px", t.onsubmit = function() {
            return f.style.visibility = "hidden", o.disabled = !0, xhr("testcode.php", "pseudo=" + a.value + "&code=" + n.value, function(e) {
                if (!e || isNaN(e)) return !1;
                var t = 1 * e;
                return t ? (mId = identifiant = t, mPseudo = a.value, mCode = n.value, i.innerHTML = "", oContainers[0].removeChild(i), selectPlayerScreen(0)) : (f.style.visibility = "visible", o.disabled = !1), !0
            }), !1
        };
        var r = document.createElement("table");
        r.border = 2, r.setAttribute("cellpadding", 1), r.setAttribute("cellspacing", 2);
        var l = document.createElement("tr"),
            s = document.createElement("td");
        s.style.textAlign = "right";
        var c = document.createElement("label");
        c.style.fontSize = 3 * iScreenScale + "px", c.setAttribute("for", "iPseudo"), c.innerHTML = toLanguage(" &nbsp; &nbsp; Nick :", "Pseudo :"), s.appendChild(c);
        var u = document.createElement("td");
        (a = document.createElement("input")).type = "text", a.name = "iPseudo", a.id = "iPseudo", a.value = mPseudo, a.style.fontSize = 3 * iScreenScale + "px", a.style.backgroundColor = "#FE7", u.appendChild(a), l.appendChild(s), l.appendChild(u);
        var p = document.createElement("tr"),
            d = document.createElement("td");
        d.style.textAlign = "right";
        var m = document.createElement("label");
        m.style.fontSize = 3 * iScreenScale + "px", m.setAttribute("for", "iCode"), m.innerHTML = "Code :", d.appendChild(m);
        var y = document.createElement("td");
        (n = document.createElement("input")).type = "password", n.name = "iCode", n.id = "iCode", n.value = mCode, n.style.fontSize = 3 * iScreenScale + "px", n.style.backgroundColor = "#FE7", y.appendChild(n), p.appendChild(d), p.appendChild(y);
        var h = document.createElement("tr"),
            g = document.createElement("td");
        g.setAttribute("colspan", 2), g.style.textAlign = "center", (o = document.createElement("input")).type = "submit", o.style.fontSize = 4 * iScreenScale + "px", o.value = toLanguage("Submit", "Valider"), g.appendChild(o), h.appendChild(g), r.appendChild(l), r.appendChild(p), r.appendChild(h), t.appendChild(r), i.appendChild(t);
        var f = document.createElement("div");
        f.style.color = "red", f.style.fontSize = 2 * iScreenScale + "pt", f.style.position = "absolute", f.style.left = 21 * iScreenScale + "px", f.style.top = 31 * iScreenScale + "px", f.innerHTML = toLanguage("Incorrect nick or password", "Pseudo ou mot de passe incorrect"), f.style.visibility = "hidden", i.appendChild(f);
        var S = document.createElement("a");
        S.style.color = "white", S.style.fontSize = 2 * iScreenScale + "pt", S.style.position = "absolute", S.style.left = 20 * iScreenScale + "px", S.style.top = 35 * iScreenScale + "px", S.innerHTML = toLanguage("Register", "Inscription"), S.setAttribute("href", "inscription.php" + ("BB" == course ? "?battle" : "")), i.appendChild(S);
        var b = document.createElement("a");
        b.style.color = "white", b.style.fontSize = 2 * iScreenScale + "pt", b.style.position = "absolute", b.style.left = 45 * iScreenScale + "px", b.style.top = 35 * iScreenScale + "px", b.innerHTML = toLanguage("Ranking", "Classement"), b.setAttribute("href", "bestscores.php" + ("BB" == course ? "?battle" : "")), i.appendChild(b);
        var v = document.createElement("input");
        v.type = "button", v.value = toLanguage("Back", "Retour"), v.style.fontSize = 2 * iScreenScale + "px", v.style.position = "absolute", v.style.left = 2 * iScreenScale + "px", v.style.top = 35 * iScreenScale + "px", v.onclick = quitter, i.appendChild(v), oContainers[0].appendChild(i), updateMenuMusic(0)
    }

    function selectFantomeScreen(ghostsData, map, otherGhostsData) {
        var oScr = document.createElement("div"),
            oStyle = oScr.style;
        oStyle.width = iWidth * iScreenScale + "px", oStyle.height = iHeight * iScreenScale + "px", oStyle.border = "solid 1px black", oStyle.backgroundColor = "black", oScr.appendChild(toTitle(lCircuits[map], .4));
        var oTable = document.createElement("table");
        oTable.setAttribute("border", "4px"), oTable.style.borderStyle = "double", oTable.style.borderColor = "gray", oTable.style.height = 8 * iScreenScale + "px", oTable.style.position = "absolute", oTable.style.left = 22 * iScreenScale + "px", oTable.style.top = 10 * iScreenScale + "px";
        var oGhost = document.createElement("tr"),
            oPersoImage = document.createElement("td");
        oPersoImage.style.width = 5 * iScreenScale + "px", oPersoImage.style.paddingRight = "6px";
        var oDiv = document.createElement("div");
        oDiv.style.position = "relative", oDiv.style.width = 5 * iScreenScale + "px", oDiv.style.height = 5 * iScreenScale + "px", oDiv.style.overflow = "hidden";
        var oPImg = new Image;
        oPImg.style.height = 5 * iScreenScale + "px", oPImg.style.position = "absolute", oPImg.className = "pixelated", ghostsData && (oPImg.alt = ghostsData[0]), oPImg.nb = i, oPImg.style.left = -30 * iScreenScale + "px", oPImg.style.top = "0px", oDiv.appendChild(oPImg), oPersoImage.appendChild(oDiv), oGhost.appendChild(oPersoImage);
        var oPersoTime = document.createElement("td"),
            gTimes;

        function writeTime(e, t, a, n) {
            n = n || oPersoTime, (a = a || oPImg).src = getSpriteSrc(e);
            var o = 67 * t,
                i = Math.floor(o / 6e4);
            o -= 6e4 * i, i += "";
            var r = Math.floor(o / 1e3);
            for (o -= 1e3 * r, (r += "").length < 2 && (r = "0" + r), o += ""; o.length < 3;) o = "0" + o;
            n.innerHTML = i + ":" + r + ":" + o
        }

        function multiGhosts(n) {
            oScr.innerHTML = "";
            var e, t = gID - 3,
                a = gID + 4;
            t < 0 ? a -= t : a > n.length && (t -= a - n.length), t = Math.max(t, 0), a = Math.min(a, n.length), (gIDs = new Array).length = a - t;
            for (var o = 0, i = t; i < a; i++) {
                gIDs[o] = i;
                var r = document.createElement("div");
                r.style.position = "absolute", r.style.left = i == a - 1 ? 20 * iScreenScale + "px" : o % 2 * iScreenScale * 40 + "px", r.style.top = (1 + 8 * Math.floor(o / 2)) * iScreenScale + "px", r.style.width = 40 * iScreenScale + "px";
                var l = document.createElement("table");
                l.setAttribute("border", "2px"), l.style.marginLeft = "auto", l.style.marginRight = "auto", l.style.borderStyle = "double", l.style.borderColor = "gray", l.style.width = 24 * iScreenScale + "px", l.style.height = 4 * iScreenScale + "px";
                var s = document.createElement("tr"),
                    c = document.createElement("td");
                c.style.width = 3 * iScreenScale + "px", c.style.paddingRight = "5px";
                var u = document.createElement("div");
                u.style.position = "relative", u.style.width = 3 * iScreenScale + "px", u.style.height = 3 * iScreenScale + "px", u.style.overflow = "hidden";
                var p = new Image;
                p.style.height = 3 * iScreenScale + "px", p.style.position = "absolute", p.className = "pixelated", ghostsData && (p.alt = ghostsData[0]), p.nb = i, p.style.left = -18 * iScreenScale + "px", p.style.top = "0px", u.appendChild(p), c.appendChild(u), s.appendChild(c);
                var d = document.createElement("td");
                d.style.textAlign = "center", d.style.fontSize = Math.round(3.5 * iScreenScale) + "px", d.style.color = "white", writeTime(n[gIDs[o]][1], n[gIDs[o]][2], p, d);
                var m = document.createElement("input");
                m.type = "button", m.value = "←", m.style.fontSize = 4 * iScreenScale + "px", m.style.position = "absolute", m.style.left = iScreenScale + "px", m.style.top = Math.round(.5 * iScreenScale) + "px",
                    function(e, t, a) {
                        m.onclick = function() {
                            gIDs[e]--, gIDs[e] < 0 && (gIDs[e] = n.length - 1), writeTime(n[gIDs[e]][1], n[gIDs[e]][2], t, a)
                        }
                    }(o, p, d), r.appendChild(m);
                var y = document.createElement("input");
                y.type = "button", y.value = "→", y.style.fontSize = 4 * iScreenScale + "px", y.style.position = "absolute", y.style.left = 32.5 * iScreenScale + "px", y.style.top = Math.round(.5 * iScreenScale) + "px",
                    function(e, t, a) {
                        y.onclick = function() {
                            gIDs[e]++, gIDs[e] >= n.length && (gIDs[e] = 0), writeTime(n[gIDs[e]][1], n[gIDs[e]][2], t, a)
                        }
                    }(o, p, d), r.appendChild(y), s.appendChild(d), l.appendChild(s), r.appendChild(l), oScr.appendChild(r), o++
            }(e = document.createElement("input")).type = "button", e.value = toLanguage("Back", "Retour"), e.style.fontSize = 2 * iScreenScale + "px", e.style.position = "absolute", e.style.left = 2 * iScreenScale + "px", e.style.top = 36 * iScreenScale + "px", e.onclick = function() {
                oScr.innerHTML = "", oContainers[0].removeChild(oScr), selectFantomeScreen(ghostsData, map, {
                    times: n,
                    id: gID
                })
            }, oScr.appendChild(e), (e = document.createElement("input")).type = "button", e.value = toLanguage("Let's go", "Commencer"), e.style.fontSize = 3 * iScreenScale + "px", e.style.position = "absolute", e.style.left = 52 * iScreenScale - 10 + "px", e.style.top = 34 * iScreenScale + "px", e.onclick = function() {
                seeGhost(!1)
            }, oScr.appendChild(e)
        }

        function showGhosts() {
            if (gTimes.length) {
                for (i = 0; i < gTimes.length - 1; i++) {
                    var e = i;
                    for (j = i + 1; j < gTimes.length; j++) gTimes[j][2] < gTimes[e][2] && (e = j);
                    var t = gTimes[e];
                    gTimes[e] = gTimes[i], gTimes[i] = t
                }
                if (-1 == gID)
                    if (ghostsData)
                        for (gID = gTimes.length - 1; gID && gTimes[gID][2] >= ghostsData[1].length;) gID--;
                    else gID = 0;
                var a = document.createElement("input");
                a.id = "fGauche", a.type = "button", a.value = "←", a.style.fontSize = 6 * iScreenScale + "px", a.style.position = "absolute", a.style.left = 12 * iScreenScale + "px", a.style.top = Math.round(10.5 * iScreenScale) + "px", a.onclick = function() {
                    --gID < 0 && (gID = gTimes.length - 1), writeTime(gTimes[gID][1], gTimes[gID][2])
                }, oScr.appendChild(a);
                var n, o = document.createElement("input");
                o.id = "fDroite", o.type = "button", o.value = "→", o.style.fontSize = 6 * iScreenScale + "px", o.style.position = "absolute", o.style.left = 63 * iScreenScale + "px", o.style.top = Math.round(10.5 * iScreenScale) + "px", o.onclick = function() {
                    ++gID >= gTimes.length && (gID = 0), writeTime(gTimes[gID][1], gTimes[gID][2])
                }, oScr.appendChild(o), writeTime(gTimes[gID][1], gTimes[gID][2]), ghostsData ? oScr.style.visibility = "visible" : oContainers[0].appendChild(oScr), OPFace && (OPFace.style.display = "none"), document.body.style.cursor = "default", (OPFace7 = document.createElement("input")).type = "button", OPFace7.value = toLanguage("7 ghosts...", "7 fantômes..."), OPFace7.style.fontSize = 2 * iScreenScale + "px", OPFace7.style.position = "absolute", OPFace7.style.right = 2 * iScreenScale + "px", OPFace7.style.top = 36 * iScreenScale + "px", OPFace7.onmouseover = function() {
                    n || ((n = document.createElement("div")).style.position = "absolute", n.style.textAlign = "center", n.style.fontSize = 2 * iScreenScale + "px", n.style.width = 30 * iScreenScale + "px", n.style.right = 2 * iScreenScale + "px", n.style.bottom = 4 * iScreenScale + "px", n.style.backgroundColor = "rgba(204,192,178,0.95)", n.style.padding = Math.round(iScreenScale / 2) + " " + iScreenScale + "px", n.style.color = "#363330", n.innerHTML = toLanguage("Play with 7 ghosts with the same level as the ghost above", "Affronter 7 fantômes du même niveau que le fantôme ci-dessus"), n.style.borderBottomLeftRadius = iScreenScale + "px", n.style.borderTopRightRadius = iScreenScale + "px", oScr.appendChild(n))
                }, OPFace7.onmouseout = function() {
                    n && (oScr.removeChild(n), n = null)
                }, OPFace7.onclick = function() {
                    n && (oScr.removeChild(n), n = null), multiGhosts(gTimes)
                }, oScr.appendChild(OPFace7)
            } else if (ghostsData) {
                try {
                    alert(language ? "No other record for this circuit yet" : "Aucun autre record pour ce circuit")
                } catch (e) {}
                oScr.style.visibility = "visible", gID = -1, document.body.style.cursor = "default"
            } else {
                oScr.innerHTML = "";
                try {
                    oContainers[0].removeChild(oScr)
                } catch (e) {}
                document.body.style.cursor = "default", gPersos.length = 0, resetGame(aAvailableMaps[map])
            }
        }

        function otherGhosts() {
            document.body.style.cursor = "progress", ghostsData && (oScr.style.visibility = "hidden"), xhr("otherghosts.php", "map=" + (map + 1), function(reponse) {
                if (reponse) {
                    try {
                        gTimes = eval(reponse)
                    } catch (e) {
                        return !1
                    }
                    gTimes = [];
                    return showGhosts(), !0
                }
                return !1
            })
        }

        function seeGhost(replay) {
            if (replay && (pause = !0, fInfos.replay = !0, gSelectedPerso = strPlayer[0]), -1 == gID) oScr.innerHTML = "", oContainers[0].removeChild(oScr), replay ? (strPlayer[0] = ghostsData[0], iTrajet = ghostsData[1]) : (gPersos = [ghostsData[0]], jTrajets = [ghostsData[1]]), resetGame(aAvailableMaps[map]);
            else {
                var xhrUrl, xhrData;
                if (oScr.innerHTML = "", oContainers[0].removeChild(oScr), document.body.style.cursor = "progress", gIDs) {
                    xhrUrl = "ghostsrace.php", xhrData = "";
                    for (var i = 0; i < gIDs.length; i++) i && (xhrData += "&"), xhrData += "id" + i + "=" + gTimes[gIDs[i]][0]
                } else xhrUrl = "ghostrace.php", xhrData = "id=" + gTimes[gID][0];
                xhr(xhrUrl, xhrData, function(reponse) {
                    if (reponse) {
                        var gCourse;
                        try {
                            gCourse = eval(reponse)
                        } catch (e) {
                            return !1
                        }
                        if (replay) strPlayer[0] = gTimes[gID][1], iTrajet = gCourse;
                        else if (gIDs) {
                            gPersos = [];
                            for (var i = 0; i < gIDs.length; i++) gPersos.push(gTimes[gIDs[i]][1]);
                            jTrajets = gCourse
                        } else gPersos = [gTimes[gID][1]], jTrajets = [gCourse];
                        return resetGame(aAvailableMaps[map]), !0
                    }
                    return !1
                })
            }
        }
        oPersoTime.style.textAlign = "center", oPersoTime.style.width = 30 * iScreenScale + "px", oPersoTime.style.fontSize = Math.round(5.5 * iScreenScale) + "px", oPersoTime.style.color = "white", gRecord = ghostsData ? ghostsData[1].length : void 0, ghostsData && writeTime(ghostsData[0], ghostsData[1].length);
        var gID = -1,
            gIDs;
        oGhost.appendChild(oPersoTime), oTable.appendChild(oGhost), oScr.appendChild(oTable);
        var oPInput = document.createElement("input");
        oPInput.type = "button", oPInput.value = toLanguage("Face with this ghost", "Affronter ce fantôme"), oPInput.style.fontSize = 3 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 22 * iScreenScale - 10 + "px", oPInput.style.top = 20 * iScreenScale + "px", oPInput.style.width = 37 * iScreenScale + 31 + "px", oPInput.onclick = function() {
            seeGhost(!1)
        }, oScr.appendChild(oPInput);
        var oPInput = document.createElement("input");
        oPInput.type = "button", oPInput.value = toLanguage("See race", "Voir la course"), oPInput.style.fontSize = 3 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 22 * iScreenScale - 10 + "px", oPInput.style.top = 25 * iScreenScale + "px", oPInput.style.width = 37 * iScreenScale + 31 + "px", oPInput.onclick = function() {
            seeGhost(!0)
        }, oScr.appendChild(oPInput);
        var oPInput = document.createElement("input");
        oPInput.type = "button", oPInput.value = toLanguage("Play alone", "Jouer seul"), oPInput.style.fontSize = 3 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 22 * iScreenScale - 10 + "px", oPInput.style.top = 30 * iScreenScale + "px", oPInput.style.width = 37 * iScreenScale + 31 + "px", oPInput.onclick = function() {
            oScr.innerHTML = "", oContainers[0].removeChild(oScr), gPersos.length = 0, resetGame(aAvailableMaps[map])
        }, oScr.appendChild(oPInput);
        var oPInput = document.createElement("input"),
            OPFace, OPFace7;
        if (oPInput.type = "button", oPInput.value = toLanguage("Back", "Retour"), oPInput.style.fontSize = 2 * iScreenScale + "px", oPInput.style.position = "absolute", oPInput.style.left = 2 * iScreenScale + "px", oPInput.style.top = 36 * iScreenScale + "px", oPInput.onclick = function() {
                -1 != gID && ghostsData ? (writeTime(ghostsData[0], ghostsData[1].length), oScr.removeChild(document.getElementById("fGauche")), oScr.removeChild(document.getElementById("fDroite")), oScr.removeChild(OPFace7), OPFace.style.display = "", gID = -1) : (oScr.innerHTML = "", oContainers[0].removeChild(oScr), selectRaceScreen(map - map % 4))
            }, oScr.appendChild(oPInput), ghostsData) {
            var OPFace = document.createElement("input");
            OPFace.type = "button", OPFace.value = toLanguage("Face with another player...", "Affronter un autre joueur..."), OPFace.style.fontSize = 2 * iScreenScale + "px", OPFace.style.position = "absolute", OPFace.style.right = 2 * iScreenScale + "px", OPFace.style.top = 36 * iScreenScale + "px", OPFace.onclick = otherGhosts, oScr.appendChild(OPFace)
        }
        ghostsData ? (oContainers[0].appendChild(oScr), document.body.style.cursor = "default", otherGhostsData && (gID = otherGhostsData.id, gTimes = otherGhostsData.times, showGhosts())) : otherGhosts(), updateMenuMusic(1)
    }

    function stripSpecialChars(e) {
        return e.replace(/&[#\w]+;/g, "_")
    }

    function mapNameOf(e, t) {
        var a = lCircuits[t],
            n = document.createElement("div"),
            o = isCup ? Math.min(Math.max(9 / Math.sqrt(stripSpecialChars(a).length), 1.4), 4) : 2.1;
        return n.style.fontSize = Math.round(e * o) + "px", n.style.width = 26 * e + "px", n.style.bottom = -Math.round(e / 2) + "px", n.className = "mapname", n.style.textAlign = "center", n.innerHTML = a, n
    }

    function addOption(e, t, a, n, o, i) {
        document.getElementById(e).innerHTML = t.replace(/ /g, "&nbsp;"), document.getElementById(a).innerHTML = "";
        var r, l = document.createElement("select");
        l.name = n;
        for (var s = 0; s < o.length; s++) {
            var c = document.createElement("option"),
                u = o[s][0];
            c.value = u, c.innerHTML = o[s][1], u == i && (r = s), l.appendChild(c)
        }
        l.selectedIndex = r, document.getElementById(a).appendChild(l)
    }

    function optionOf(e) {
        return formulaire ? 1 * formulaire.elements[e].value : baseOptions[e]
    }

    function displayCommands(e, t) {
        var a = document.getElementById("commandes");
        a && (t ? (a.innerHTML = e + '<img src="images/edit-controls.png" alt="Edit" id="commandes-edit" title="' + toLanguage("Edit controls", "Modifier les contrôles") + '" />', document.getElementById("commandes-edit").onclick = function() {
            editCommands()
        }) : a.innerHTML = e)
    }

    function updateCommandSheet() {
        var n = getCommands(),
            o = 0 <= navigator.platform.toUpperCase().indexOf("MAC");

        function e(e, t) {
            return 1 == oContainers.length ? e : "J1 : " + e + "; J2 : " + t
        }

        function t(e) {
            var t = n[e],
                a = t[0];
            return t[1] && o && (a = t[1]), getKeyName(a)
        }
        displayCommands("<strong>" + toLanguage("Move", "Se diriger") + "</strong> : " + e(t("up") + t("left") + t("down") + t("right"), "ESDF") + "<br /><strong>" + toLanguage("Use item", "Utiliser un objet") + "</strong> : " + e(t("item"), toLanguage("A", "Q")) + "<br /><strong>" + toLanguage("Item backwards", "Objet en arrière") + "</strong> : " + e(t("item_back"), toLanguage("W", "A")) + "<br /><strong>" + toLanguage("Jump/drift", "Sauter/déraper") + "</strong> : " + e(t("jump"), "G") + ("BB" == course ? "<br /><strong>" + toLanguage("Inflate a balloon", "Gonfler un ballon") + "</strong> : " + e(t("balloon"), "R") : "") + "<br /><strong>" + toLanguage("Rear/Front view", "Vue arri&egrave;re/avant") + "</strong> : " + e(t("rear"), toLanguage("W", "Z")) + "<br /><strong>" + toLanguage("Pause", "Mettre en pause") + "</strong> : " + t("pause") + "<br /><strong>" + toLanguage("Quit", "Quitter") + "</strong> : " + t("quit"), !0)
    }

    function editCommands(e) {
        var t = document.getElementById("control-editor-mask");
        if (!t || (document.body.removeChild(t), e)) {
            (t = document.createElement("div")).id = "control-editor-mask", t.onclick = function() {
                editCommands()
            };
            var a = document.createElement("div");
            a.className = "control-editor", a.onclick = function(e) {
                e.stopPropagation()
            };
            var n = document.createElement("div");
            n.className = "control-header";
            var o = document.createElement("div");
            o.innerHTML = toLanguage("Edit controls", "Modifier les contrôles"), n.appendChild(o);
            var i = document.createElement("button");
            i.className = "control-close", i.innerHTML = "&times;", i.onclick = function() {
                editCommands()
            }, n.appendChild(i), a.appendChild(n);
            var r = [{
                    name: toLanguage("Move forward", "Avancer"),
                    key: "up"
                }, {
                    name: toLanguage("Move back", "Reculer"),
                    key: "down"
                }, {
                    name: toLanguage("Turn left", "Tourner à gauche"),
                    key: "left"
                }, {
                    name: toLanguage("Turn right", "Tourner à droite"),
                    key: "right"
                }, {
                    name: toLanguage("Use item", "Utiliser un objet"),
                    key: "item"
                }, {
                    name: toLanguage("Item backwards", "Objet en arrière"),
                    key: "item_back"
                }, {
                    name: toLanguage("Jump/drift", "Sauter/déraper"),
                    key: "jump"
                }, {
                    name: toLanguage("Inflate balloon", "Gonfler un ballon"),
                    key: "balloon"
                }, {
                    name: toLanguage("Rear view", "Vue arrière"),
                    key: "rear"
                }, {
                    name: toLanguage("Pause", "Pause"),
                    key: "pause"
                }, {
                    name: toLanguage("Quit", "Quitter"),
                    key: "quit"
                }],
                l = getCommands(),
                s = JSON.parse(localStorage.getItem("controls") || "{}"),
                c = 0 <= navigator.platform.toUpperCase().indexOf("MAC"),
                u = document.createElement("div");
            u.className = "control-editor-grid";
            for (var p = 0; p < r.length; p++) ! function(t) {
                var e = l[t.key],
                    a = e[0];
                e[1] && c && (a = e[1]);
                var n = document.createElement("div"),
                    o = document.createElement("div");
                o.className = "control-label", o.innerHTML = t.name, n.appendChild(o);
                var i = document.createElement("button");
                i.className = "control-input", i.innerHTML = getKeyName(a), i.onfocus = function() {
                    this.innerHTML = "..."
                }, i.onblur = function() {
                    this.innerHTML = getKeyName(a)
                }, i.onclick = function() {
                    this.focus()
                }, i.onkeydown = function(e) {
                    e.preventDefault(), e.stopPropagation(), a = e.keyCode, s[t.key] = a, localStorage.setItem("controls", JSON.stringify(s)), gameControls = gameControls && getGameControls(), this.blur()
                }, n.appendChild(i), u.appendChild(n)
            }(r[p]);
            a.appendChild(u);
            var d = document.createElement("div");
            d.className = "control-reset";
            var m = document.createElement("a");
            m.href = "#null", m.innerHTML = toLanguage("Reset controls", "Rétablir les contrôles par défaut"), m.onclick = function() {
                return confirm(toLanguage("Reset to default controls?", "Confirmer la réinitialisation des contrôles ?")) && (localStorage.removeItem("controls"), gameControls = gameControls && getGameControls(), editCommands(!0)), !1
            }, d.appendChild(m), a.appendChild(d), t.appendChild(a), document.body.appendChild(t)
        } else updateCommandSheet()
    }

    function getKeyName(e) {
        return this.keyMatching || (this.keyMatching = ["", "", "", "Break", "", "", "", "", "Backspace", "Tab", "", "", "Clear", "Enter", "", "", "Shift", "Ctrl", "Alt", "Pause", "CapsLock", "Hangul", "", "", "", "Hanja", "", toLanguage("Escape", "Échap"), "Conversion", "Non-conversion", "", "", toLanguage("Spacebar", "Espace"), "PageUp", "PageDown", "End", "Home", "&larr;", "&uarr;", "&rarr;", "&darr;", "Select", "Print", "Execute", toLanguage("Print Screen", "ImpEcr"), "Inser", toLanguage("Delete", "Suppr"), "Help", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", "=", "&lt;", "=", "", "SS", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Meta", "Meta", "Meta", "", "Sleep", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "&times;", "+", ".", "-", ".", "/", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NumLock", "ScrollLock", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "^", "!", "؛", "#", "$", "Ù", "PageDown", "PageUp", "Refresh", ")", "*", "~", "Home", "-", "Vol. down", "Vol. up", "Next", "Previous", "Stop", "Play/pause", "@", "Mute", "Vol. down", "Vol. up", "", "", "Ñ", "=", ",", "#", ".", "/", "%", "°", ",", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "{", "\\", "}", "'", "`", "Meta", "AltGr", "&lt;", "", "", "", "Compose", "Ç", "", "Forward", "Back", "Non-conversion", "", "", "", "", "Alphanumeric", "", "Hiragana", "Half-width", "Kanji", "", "", "", "", "", "", "Unlock Trackpad", "", "", "", "Toggle Touchpad"]), this.keyMatching[e] ? this.keyMatching[e] : "#" + e
    }

    function getCommands() {
        var e = {
            up: [38],
            down: [40],
            left: [37],
            right: [39],
            item: [32],
            item_back: [67],
            jump: [17, 18],
            balloon: [16],
            rear: [88],
            pause: [80],
            quit: [27],
            cheat: [120, 33, 57, 105],
            fastfwd: [118, 36, 55, 103]
        };
        1 < strPlayer.length && (e.up_p2 = [69], e.down_p2 = [68], e.left_p2 = [83], e.right_p2 = [70], e.item_p2 = [toLanguage(65, 81)], e.item_back_p2 = [toLanguage(87, 65)], e.jump_p2 = [71], e.balloon_p2 = [82], e.rear_p2 = [toLanguage(87, 90)]);
        var t = e,
            a = localStorage.getItem("controls");
        if (a)
            for (var n in a = JSON.parse(a)) t[n] = [a[n]];
        return t
    }

    function getGameControls() {
        var e = {},
            t = getCommands();
        for (var a in t)
            for (var n = 0; n < t[a].length; n++) {
                var o = t[a][n];
                e[o] || (e[o] = a)
            }
        return e
    }

    function findKeyCode(e) {
        for (var t in gameControls)
            if (gameControls[t] == e) return t;
        return ""
    }

    function toLanguage(e, t) {
        return language ? e : t
    }

    function toPlace(e) {
        var t;
        if (language) switch (e) {
            case 1:
                t = "st";
                break;
            case 2:
                t = "nd";
                break;
            case 3:
                t = "rd";
                break;
            default:
                t = "th"
        } else t = 1 != e ? "e" : "er";
        return e + "<sup>" + t + "</sup>"
    }

    function toTitle(e, t) {
        var a = document.createElement("div");
        return a.style.width = iWidth * iScreenScale + "px", a.style.fontSize = Math.round(8 * iScreenScale) + "px", a.style.fontWeight = "normal", a.style.position = "absolute", a.style.left = "0px", a.style.top = Math.round(t * iScreenScale) + "px", a.style.textAlign = "center", a.style.color = "yellow", a.innerHTML = e, a.style.fontFamily = "Tahoma", a
    }

    function toPerso(e) {
        if (isCustomPerso(e)) return customPersos[e].name;
        if (language) {
            if ("maskass" == e) return "shy guy";
            if ("skelerex" == e) return "dry bones";
            if ("harmonie" == e) return "rosalina";
            if ("roi_boo" == e) return "king boo";
            if ("frere_marto" == e) return "hammer bro"
        } else if ("frere_marto" == e) return "frère marto";
        return e = e.replace(/_/g, " ")
    }
    if (String.prototype.startsWith || (String.prototype.startsWith = function(e, t) {
            return t = t || 0, this.indexOf(e, t) === t
        }), pause) formulaire.screenscale.disabled = !1, formulaire.quality.disabled = !1, formulaire.music.disabled = !1, formulaire.sfx.disabled = !1, isSingle && !isOnline ? choose(1) : "VS" == course ? selectMapScreen() : "BB" == course ? isCup ? selectRaceScreen(NBCIRCUITS) : selectMapScreen() : loadMap(fInfos.map);
    else {
        if (addOption("pQuality", toLanguage("Quality", "Qualit&eacute;"), "vQuality", "quality", [
                [5, toLanguage("Pixelated", "Pixelisé")],
                [4, toLanguage("Low", "Inf&eacute;rieure")],
                [2, toLanguage("Medium", "Moyenne")],
                [1, toLanguage("High", "Sup&eacute;rieure")]
            ], iRendering), addOption("pSize", toLanguage("Screen Size", "Taille de l'&eacute;cran"), "vSize", "screenscale", [
                [4, toLanguage("Very small", "Tr&egrave;s petite")],
                [6, toLanguage("Small", "Petite")],
                [8, toLanguage("Medium", "Moyenne")],
                [10, toLanguage("Large", "Large")],
                [12, toLanguage("Very large", "Tr&egrave;s large")]
            ], iScreenScale), addOption("pMusic", toLanguage("Music", "Musique"), "vMusic", "music", [
                [0, toLanguage("Off", "D&eacute;sactiv&eacute;e")],
                [1, toLanguage("On", "Activ&eacute;e")]
            ], bMusic), addOption("pSfx", toLanguage("Sound effects", "Bruitages"), "vSfx", "sfx", [
                [0, toLanguage("Off", "D&eacute;sactiv&eacute;s")],
                [1, toLanguage("On", "Activ&eacute;s")]
            ], iSfx), selectMainPage(), !window.turnEvents) {
            if (isMobile()) {
                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate || function() {}, addButton(' <span style="position:absolute;left:8px;top:-5px">↑</span><span style="position:absolute;right:6px;bottom:8px;font-size:10px;text-align:right">' + (language ? "+ Jump<br/>Drift" : "+ Saut<br/>Dérapage") + "</span>", [38, 17], 0, 0), addButton(" ↑ ", 38, 1, 0), addButton("Obj", 32, 2, 0, null, null, 25), addButton("❚❚", 80, 3, 0, null, null, 25), document.getElementById("virtualkeyboard").appendChild(document.createElement("br")), document.getElementById("virtualkeyboard").appendChild(document.createElement("br"));
                var driftButton = addButton(language ? "Jump<br/>Drift" : "Saut<br/>Dérapage", 17, 0, 1, null, null, 11);
                addButton(" ↓ ", 40, 1, 1), addButton(" ← ", 37, 2, 1), addButton(" → ", 39, 3, 1), reposKeyboard(), document.getElementById("virtualkeyboard").ontouchstart = function(e) {
                    return e.preventDefault(), !1
                }, document.getElementById("virtualkeyboard").style.display = "block";
                var $commandes = document.getElementById("commandes");
                $commandes && ($commandes.style.display = "none")
            }
            window.turnEvents = !0
        }
        formulaire = document.forms.modes, formulaire.quality.onchange = function() {
            var e = parseInt(this.item(this.selectedIndex).value);
            MarioKartControl.setQuality(e)
        }, formulaire.screenscale.onchange = function() {
            var e = parseInt(this.item(this.selectedIndex).value);
            MarioKartControl.setScreenScale(e)
        }, formulaire.music.onchange = function() {
            var e = parseInt(this.item(this.selectedIndex).value);
            MarioKartControl.setMusic(e)
        }, formulaire.sfx.onchange = function() {
            var e = parseInt(this.item(this.selectedIndex).value);
            MarioKartControl.setSfx(e)
        }
    }

    function isMobile() {
        return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
    }

    function isChatting() {
        return isOnline && document.activeElement == document.forms[1].elements.rMessage
    }

    function applyButtonCode(e, t) {
        for (var a = t.split(","), n = 0; n < a.length; n++) document[e]({
            keyCode: parseInt(a[n])
        })
    }

    function onButtonTouch(e) {
        return e.preventDefault(), this.style.backgroundColor = "#603", navigator.vibrate(30), applyButtonCode("onkeydown", this.dataset.key), !1
    }

    function onButtonPress(e) {
        this.style.backgroundColor = "", applyButtonCode("onkeyup", this.dataset.key)
    }

    function setChat() {
        chatting = !0;
        var oChat = document.createElement("div");
        oChat.className = "online-chat", oChat.style.position = "absolute", oChat.style.zIndex = 3, oChat.style.backgroundColor = "black", oChat.style.right = "10px", oChat.style.top = "5%", oChat.style.width = "350px", oChat.style.height = "90%", oChat.style.border = "double 4px silver";
        var oConnectes = document.createElement("p");
        oConnectes.style.paddingBottom = "2px", oConnectes.style.borderBottom = "solid 1px silver";
        var iConnectes = document.createElement("span");
        iConnectes.innerHTML = toLanguage("Online opponent(s) : ", "Adversaire(s) en ligne : "), oConnectes.appendChild(iConnectes);
        var jConnectes = document.createElement("span");
        jConnectes.style.color = "white", oConnectes.appendChild(jConnectes);
        var bConnectes = document.createElement("a"),
            oBlockDialog;

        function removeBlockDialog() {
            return !!oBlockDialog && (oChat.removeChild(oBlockDialog), !(oBlockDialog = null))
        }
        bConnectes.href = "#null", bConnectes.style.textDecoration = "none", bConnectes.title = language ? "Ignore player" : "Ignorer un joueur", bConnectes.style.marginLeft = "10px", bConnectes.style.opacity = .7, oConnectes.onmouseover = function() {
            bConnectes.style.opacity = 1
        }, oConnectes.onmouseout = function() {
            bConnectes.style.opacity = .7
        }, bConnectes.style.position = "relative", bConnectes.style.top = "2px", bConnectes.onmouseover = function() {
            biConnectes.src = "images/ic_block_h.png"
        }, bConnectes.onmouseout = function() {
            biConnectes.src = "images/ic_block.png"
        }, bConnectes.onclick = function() {
            if (removeBlockDialog()) return !1;
            oBlockDialog = document.createElement("div"), oBlockDialog.style.position = "absolute", oBlockDialog.style.left = "85px", oBlockDialog.style.top = "8%", oBlockDialog.style.width = "200px", oBlockDialog.style.border = "double 4px silver", oBlockDialog.style.backgroundColor = "#222";
            var oBlockTitle = document.createElement("h1");
            oBlockTitle.style.fontSize = "1.1em", oBlockTitle.style.marginTop = "24px", oBlockTitle.style.marginBottom = "2px", oBlockTitle.style.textAlign = "center", oBlockTitle.innerHTML = language ? "Ignore member" : "Ignorer un membre", oBlockTitle.style.color = "white", oBlockTitle.style.textDecoration = "underline", oBlockDialog.appendChild(oBlockTitle);
            var oBlockClose = document.createElement("input");
            oBlockClose.type = "button", oBlockClose.onclick = function() {
                removeBlockDialog()
            }, oBlockClose.style.position = "absolute", oBlockClose.style.right = "5px", oBlockClose.style.top = "5px", oBlockClose.value = "×", oBlockDialog.appendChild(oBlockClose);
            var oBlockMembers = document.createElement("div");
            return oBlockMembers.style.margin = "3px 4px", xhr("listCoursePlayers.php", "", function(reponse) {
                if (reponse) {
                    try {
                        var rCode = eval(reponse)
                    } catch (e) {
                        return !1
                    }

                    function stylishMember(e) {
                        e.dataset.blocked ? (e.style.color = "red", e.style.textDecoration = "line-through", e.style.opacity = .8) : (e.style.color = "#F90", e.style.textDecoration = "", e.style.opacity = 1)
                    }
                    for (var i = 0; i < rCode.length; i++) {
                        var memberId = rCode[i][0],
                            memberPseudo = rCode[i][1],
                            memberBlocked = rCode[i][2],
                            oBlockMember = document.createElement("div");
                        oBlockMember.dataset || (oBlockMember.dataset = {}), oBlockMember.dataset.id = memberId, oBlockMember.dataset.blocked = memberBlocked ? "1" : "", oBlockMember.innerHTML = memberPseudo, oBlockMember.style.padding = "2px 5px", oBlockMember.style.cursor = "pointer", oBlockMember.style.margin = "1px", oBlockMember.style.backgroundColor = "#666", oBlockMember.style.color = oBlockMember.dataset.blocked ? "red" : "#F90", oBlockMember.onmouseover = function() {
                            this.style.backgroundColor = "#777", this.style.color = "#FC0"
                        }, oBlockMember.onmouseout = function() {
                            this.style.backgroundColor = "#666", this.style.color = this.dataset.blocked ? "red" : "#F90"
                        }, stylishMember(oBlockMember), oBlockMember.onclick = function() {
                            this.dataset.blocked = this.dataset.blocked ? "" : "1";
                            var t = this;
                            xhr(this.dataset.blocked ? "ignore.php" : "unignore.php", "member=" + this.dataset.id, function(e) {
                                return 1 == e && (stylishMember(t), !0)
                            })
                        }, oBlockMembers.appendChild(oBlockMember)
                    }
                    return !0
                }
                return !1
            }), oBlockDialog.appendChild(oBlockMembers), oChat.appendChild(oBlockDialog), !1
        };
        var biConnectes = document.createElement("img");
        biConnectes.alt = "Block", biConnectes.src = "images/ic_block.png", biConnectes.style.height = "16px", bConnectes.appendChild(biConnectes), oConnectes.appendChild(bConnectes);
        var oMessages = document.createElement("div");
        oMessages.style.paddingTop = "2px";
        var oRepondre = document.createElement("form");
        oRepondre.style.position = "absolute", oRepondre.style.bottom = "0", oRepondre.style.left = "10px";
        var rP = document.createElement("p");
        rP.style.textAlign = "center";
        var rMessage = document.createElement("input");
        rMessage.setAttribute("size", 35), rMessage.type = "text", rMessage.name = "rMessage", rMessage.onkeydown = function(e) {
            e.stopPropagation()
        }, rMessage.onkeyup = function(e) {
            e.stopPropagation()
        }, rMessage.style.backgroundColor = "#FE7";
        var rEnvoi = document.createElement("input");

        function refreshChat() {
            chatting ? (xhr("chat.php", "", function(reponse) {
                if (reponse) {
                    try {
                        var rCode = eval(reponse)
                    } catch (e) {
                        return !1
                    }
                    if (-1 != rCode) {
                        for (var noms = rCode[0], sNoms = "", i = 0; i < noms.length; i++) sNoms += (i ? ", " : "") + noms[i];
                        jConnectes.innerHTML = sNoms;
                        for (var messages = rCode[1], pMessages = oMessages.getElementsByTagName("p"); pMessages.length;) oMessages.removeChild(pMessages[0]);
                        for (var i = 0; i < messages.length; i++) {
                            var oP = document.createElement("p"),
                                sPseudo = document.createElement("span");
                            sPseudo.innerHTML = messages[i][0] + " : ", oP.appendChild(sPseudo);
                            var sMessage = document.createElement("span");
                            sMessage.style.color = "white", sMessage.style.fontWeight = "normal", sMessage.innerHTML = messages[i][1], oP.appendChild(sMessage), oMessages.appendChild(oP)
                        }
                    } else chatting = !1;
                    return !0
                }
                return !1
            }), setTimeout(refreshChat, 1e3)) : document.body.removeChild(oChat)
        }
        rEnvoi.type = "submit", rEnvoi.value = toLanguage("Send", "Envoyer"), rP.appendChild(rMessage), rP.appendChild(rEnvoi), oRepondre.onsubmit = function() {
            return rMessage.value && (xhr("parler.php", "msg=" + encodeURIComponent(rMessage.value).replace(/\+/g, "%2B"), function(e) {
                return "1" == e
            }), rMessage.value = ""), !1
        }, oRepondre.appendChild(rP), oChat.appendChild(oConnectes), oChat.appendChild(oMessages), oChat.appendChild(oRepondre), refreshChat(), document.body.appendChild(oChat)
    }
    window.MarioKartControl = {
        setQuality: function(e) {
            setQuality(e)
        },
        setScreenScale: function(e) {
            setScreenScale(e)
        },
        setMusic: function(e) {
            setMusic(e)
        },
        setSfx: function(e) {
            setSfx(e)
        }
    }
}
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);