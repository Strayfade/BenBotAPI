const Discord = require('discord.js');
const client = new Discord.Client();
const rp = require('request-promise')

var urlBase = "https://benbotfn.tk/api/v1/"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.content === 'ping') 
    {
        msg.reply('Pong!');
    }
    if (msg.content.toUpperCase().startsWith(".aes".toUpperCase()))
    {
        var url = urlBase + "aes"
        rp(url)
        .then(function(html) 
        {
            var html2 = JSON.parse(html)
        
            var version = html2.version
            var mainKey = html2.mainKey
            var dynamicKeys = []
            var dynamicPaks = []
            dynamicPaks = Object.getOwnPropertyNames(html2.dynamicKeys)
            for(var i = 0; i < dynamicPaks.length; i++)
            {
                dynamicKeys.push(html2.dynamicKeys[dynamicPaks[i]])
            }
            let embed = new Discord.MessageEmbed()
            embed.setTitle('/aes API Endpoint')
            embed.addField("Main AES: ",  mainKey + "\n\n")
            for(var i = 0; i < dynamicKeys.length; i++)
            {
                embed.addField(dynamicPaks[i] + ": ", dynamicKeys[i])
            }
            embed.addField("Version: ", version)
            msg.channel.send(embed)
        })
    }
    if (msg.content.toUpperCase().startsWith(".search".toUpperCase()))
    {
        var url = urlBase + "cosmetics/br/search"
        url += "?name=" + msg.content.toString().toUpperCase().replace(".search ".toUpperCase(), "")
        rp(url)
        .then(function(html) 
        {
            var html2 = JSON.parse(html)
            //console.log(html2)
            let embed = new Discord.MessageEmbed()
            embed.setTitle('/cosmetics/br/search API Endpoint')
            
            var CID = html2.id;
            var path = html2.path;

            var icon
            var featuredIcon;
            var seriesIcon;
            var hasIcon = false;
            var hasFeaturedIcon = false;
            var hasSeriesIcon = false;
            if (html2.icons.icon != null)
            {
                hasIcon = true;
                icon = html2.icons.icon;
            }
            if (html2.icons.featured != null)
            {
                hasFeaturedIcon = true;
                featuredIcon = html2.icons.featured;
            }
            if (html2.icons.series != null)
            {
                hasSeriesIcon = true;
                seriesIcon = html2.icons.series;
            }

            var name = html2.name;
            
            var hasDescription = false;
            var description = "";
            if (html2.description != null)
            {
                hasDescription = true;
                description = html2.description;
            }

            var hasShortDescription = false;
            var shortDescription = "";
            if (html2.shortDescription != null)
            {
                hasShortDescription = true;
                shortDescription = html2.shortDescription;
            }

            var backendType = html2.backendType;
            var rarity = html2.rarity;
            var backendRarity = html2.backendRarity;

            var hasSet = false;
            var hasSetText = false;
            var set = "";
            var setText = "";
            if (html2.setText != null)
            {
                hasSetText = true;
                setText = html2.setText;
            }
            if (html2.set != null)
            {
                hasSet = true;
                set = html2.set
                setText = "Part of the **" + set + "** set."
            }

            var hasSeries = false;
            var series;
            if (html2.series != null)
            {
                hasSeries = true;
                series = html2.series.name;
            }

            var hasVariants = false;
            var variants;
            if (html2.variants != null)
            {
                hasVariants = true;
                variants = html2.variants;
            }

            var showReleaseDate = true;

            var sourceTags = html2.gameplayTags[0];
            var setTags = html2.gameplayTags[1];
            var filterTags = html2.gameplayTags[2];

            if (hasShortDescription)
            {
                embed.setTitle(shortDescription + ": " + name)
            }
            else
            {
                embed.setTitle(name)
            }
            if (hasDescription)
            {
                embed.setDescription(description)
            }
            var frontendSource = "‎";
            for (var i = 0; i < html2.gameplayTags.length; i++)
            {
                if (html2.gameplayTags[i].toString().startsWith("Cosmetics.Source."))
                {
                    if (html2.gameplayTags[i].toString().startsWith("Cosmetics.Source.Platform."))
                    {
                        var rce = html2.gameplayTags[i].replace("Cosmetics.Source.Platform.", "")
                        frontendSource = "Platform Item: **" + rce + "**"
                    }
                    else if (html2.gameplayTags[i].toString().startsWith("Cosmetics.Source.Promo"))
                    {
                        var rce = html2.gameplayTags[i].replace("Cosmetics.Source.", "")
                        frontendSource = rce
                    }
                    else if (html2.gameplayTags[i].toString().endsWith(".BattlePass.Paid"))
                    {
                        var rce = html2.gameplayTags[i].replace("Cosmetics.Source.Season", "")
                        frontendSource = "Paid Battle Pass: **Season " + rce.replace(".BattlePass.Paid", "**")
                    }
                    else if (html2.gameplayTags[i].toString().endsWith(".BattlePass.Free"))
                    {
                        var rce = html2.gameplayTags[i].replace("Cosmetics.Source.Season", "")
                        frontendSource = "Free Battle Pass: **Season " + rce.replace(".BattlePass.Free", "**")
                    }
                    else if (html2.gameplayTags[i].toString().endsWith("ItemShop"))
                    {
                        frontendSource = "Item Shop"
                    }
                }
            }
            var frontendReleaseDate = "PH"
            if (true)
            {
                for (var i = 0; i < html2.gameplayTags.length; i++)
                {
                    if (html2.gameplayTags[i].startsWith("Cosmetics.Filter."))
                    {
                        var releaseDate = html2.gameplayTags[i].replace("Cosmetics.Filter.", "").replace(".", " ")
                        frontendReleaseDate = "Introduced in **" + releaseDate + "**."
                    }
                }
            }
            var shortCID = ""
            var cid = ""
            if (shortDescription.startsWith("BID") || shortDescription.startsWith("CID"))
            {
                for (var i = 0; i < 7; i++)
                {
                    cid += CID[i]
                }
                shortCID = cid
                cid = CID
            }
            else
            {
                cid = CID
            }
            if (hasSetText)
            {
                embed.addFields(
                    { name: "‎", value: setText, inline: false }
                )
            }
            if (frontendReleaseDate != "PH")
            {
                embed.addFields(
                    { name: "‎", value: frontendReleaseDate, inline: false }
                )
            }
            embed.addFields(
                { name: "‎", value: "‎", inline: false }
            )
            embed.addFields(
                { name: 'Item Locker Rarity: ', value: rarity, inline: true },
                { name: 'Backend Rarity: ', value: backendRarity, inline: true },
                { name: 'ID: ', value: cid + "\u200B", inline: true },
                { name: 'Backend Type: ', value: backendType, inline: false },
                { name: 'Path: ', value: path.toString().replace("FortniteGame/Content/Athena/", "FortniteGame/Content/Athena/"), inline: false },    
                { name: 'Source: ', value: frontendSource, inline: false },
            )
            var showGameplayTags = false;
            for (var i = 0; i < html2.gameplayTags.length; i++)
            {
                if (showGameplayTags)
                {
                    embed.addField('Tag ' + (i + 1).toString(), html2.gameplayTags[i], true)
                }
            }
            if (hasSeries)
            {
                var seriesText = series.toString().replace(" Series", "")
                embed.addField("Series: ", "**" + seriesText + "**");
            }
            var colors
            if (hasSeries)
            {
                colors = html2.series.colors;
                var r = colors.Color1.r;
                var g = colors.Color1.g;
                var b = colors.Color1.b;
                embed.setColor([r, g, b])
            }
            else
            {
                if (rarity.toString() === 'Mythic')
                {
                    var r = 255;
                    var g = 255;
                    var b = 0;
                    embed.setColor([r, g, b])
                }
                if (rarity.toString() === 'Legendary')
                {
                    var r = 255;
                    var g = 170;
                    var b = 0;
                    embed.setColor([r, g, b])
                }
                if (rarity.toString() === 'Epic')
                {
                    var r = 255;
                    var g = 0;
                    var b = 255;
                    embed.setColor([r, g, b])
                }
                if (rarity.toString() === 'Rare')
                {
                    var r = 0;
                    var g = 50;
                    var b = 255;
                    embed.setColor([r, g, b])
                }
                if (rarity.toString() === 'Uncommon')
                {
                    var r = 0;
                    var g = 255;
                    var b = 0;
                    embed.setColor([r, g, b])
                }
                if (rarity.toString() === 'Common')
                {
                    var r = 200;
                    var g = 200;
                    var b = 200;
                    embed.setColor([r, g, b])
                }
            }
            embed.setFooter("Item Request: " + name, icon)
            embed.setTimestamp()
            msg.channel.send(embed)

            var embed2 = new Discord.MessageEmbed()
            if (hasSeries)
            {
                colors = html2.series.colors;
                var r = colors.Color1.r;
                var g = colors.Color1.g;
                var b = colors.Color1.b;
                embed2.setColor([r, g, b])
            }
            else
            {
                if (rarity.toString() === 'Mythic')
                {
                    var r = 255;
                    var g = 255;
                    var b = 0;
                    embed2.setColor([r, g, b])
                }
                if (rarity.toString() === 'Legendary')
                {
                    var r = 255;
                    var g = 170;
                    var b = 0;
                    embed2.setColor([r, g, b])
                }
                if (rarity.toString() === 'Epic')
                {
                    var r = 255;
                    var g = 0;
                    var b = 255;
                    embed2.setColor([r, g, b])
                }
                if (rarity.toString() === 'Rare')
                {
                    var r = 0;
                    var g = 50;
                    var b = 255;
                    embed2.setColor([r, g, b])
                }
                if (rarity.toString() === 'Uncommon')
                {
                    var r = 0;
                    var g = 255;
                    var b = 0;
                    embed2.setColor([r, g, b])
                }
                if (rarity.toString() === 'Common')
                {
                    var r = 200;
                    var g = 200;
                    var b = 200;
                    embed2.setColor([r, g, b])
                }
            }
            if (hasSeriesIcon)
            {
                embed2.setImage(seriesIcon)
            }
            else if (hasFeaturedIcon)
            {
                embed2.setImage(featuredIcon)
            }
            else if (hasIcon)
            {
                embed2.setImage(icon)
            }
            embed2.setFooter("Image for " + name)
            embed2.setTimestamp()
            msg.channel.send(embed2)
        })
    }
    if (msg.content.toUpperCase().startsWith(".calendar-store".toUpperCase()) || msg.content.toUpperCase().startsWith(".store".toUpperCase()))
    {
        var url = urlBase + "calendar"
        rp(url)
        .then(function(html) 
        {
            var html2 = JSON.parse(html)
            //console.log(html2)
            //console.log(html2.channels["standalone-store"].states)
            
            var states = html2.channels["standalone-store"].states
            for (var i = 0; i < states.length; i++)
            {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Store Detected (" + (i + 1) + " of " + states.length + ")")
                embed.setDescription("Activated on " + states[i].validFrom.toString().replace("T", " ").replace("Z", ""))
                
                var keys = Object.getOwnPropertyNames(states[i].state)
                var keyData = []
                for(var x = 0; x < keys.length; x++)
                {
                    keyData.push(states[i].state[keys[x].toString()] + "‎")
                    for (var z = 0; z < keyData.length; z++)
                    {
                        if (keyData[z] === "‎")
                        {
                            keyData[z] = "None"
                        }
                        if (keyData[z].toString().endsWith("Z"))
                        {
                            keyData[z] = keyData[z].toString().replace("T", " ").replace("Z", "")
                        }
                    }
                    embed.addField(keys[x] + ": ", keyData[x])
                }
                msg.channel.send(embed);
            }
        })
    }
    if (msg.content.toUpperCase().startsWith(".calendar-ltm".toUpperCase()) || msg.content.toUpperCase().startsWith(".ltm".toUpperCase()))
    {
        var url = urlBase + "calendar"
        rp(url)
        .then(function(html) 
        {
            var html2 = JSON.parse(html)
            //console.log(html2.channels["client-matchmaking"].states)
            var states = html2.channels["client-matchmaking"].states
            for (var i = 0; i < states.length; i++)
            {
                let embed = new Discord.MessageEmbed()

                embed.setTitle("LTM Detected (" + (i + 1) + " of " + states.length + ")")
                embed.setDescription("Activated on " + states[i].validFrom.toString().replace("T", " ").replace("Z", ""))
                var gameModeState = states[i].state.region.NAE
                if (gameModeState.eventFlagsForcedOn != null && gameModeState.eventFlagsForcedOn != undefined)
                {
                    for (var x = 0; x < gameModeState.eventFlagsForcedOn.length; x++)
                    {
                        embed.addField("Activated LTM: ", gameModeState.eventFlagsForcedOn[x])
                    }
                }
                if (gameModeState.eventFlagsForcedOff != null && gameModeState.eventFlagsForcedOff != undefined)
                {
                    for (var x = 0; x < gameModeState.eventFlagsForcedOff.length; x++)
                    {
                        embed.addField("Deactivated LTM: ", gameModeState.eventFlagsForcedOff[x])
                    }
                }
                embed.setTimestamp()
                msg.channel.send(embed)
            }

        })
    }
    if (msg.content.toUpperCase().startsWith(".calendar-event".toUpperCase()))
    {
        var url = urlBase + "calendar"
        rp(url)
        .then(function(html) 
        {
            var html2 = JSON.parse(html)
            //console.log(html2.channels["client-events"].states)
            var states = html2.channels["client-events"].states[0].activeEvents
            for (var i = 0; i < states.length; i++)
            {
                let embed = new Discord.MessageEmbed()

                embed.setTitle("Client Event Detected (" + (i + 1) + " of " + states.length + ")")
                embed.addField("Event: ", states[i].eventType.toString())
                embed.addField("Activated on: ", states[i].activeSince.toString().replace("T", " ").replace("Z", ""))
                embed.addField("Deactivates on: ", states[i].activeUntil.toString().replace("T", " ").replace("Z", ""))
                embed.setTimestamp()
                msg.channel.send(embed)
            }

        })
    }
    if (msg.content.toUpperCase().startsWith(".shop-sections".toUpperCase()))
    {
        var url = urlBase + "shop/br"
        rp(url)
        .then(function(html)
        {
            html2 = JSON.parse(html)
            var shop = html2
            var objectKeys = []
            var objectData = []
            
            var sections = []

            objectKeys = Object.getOwnPropertyNames(shop)
            
            for (var i = 0; i < objectKeys.length; i++)
            {
                objectData.push(shop[objectKeys[i]])
            }

            for (var i = 0; i < objectKeys.length; i++)
            {
                if (objectKeys[i].toString().endsWith("Title"))
                {
                    sections.push(shop[objectKeys[i]])
                }
            }

            let embed = new Discord.MessageEmbed()
            embed.setTitle('/shop/br API Endpoint')
            embed.setDescription("Shop Sections Response")
            embed.addFields(
                { name: '\u200B', value: '\u200B' },
            )
            for (var i = 0; i < sections.length; i++)
            {
                embed.addField("Section " + (i + 1).toString() + ": ", sections[i], true)
            }
            embed.addFields(
                { name: '\u200B', value: '\u200B' },
            )
            embed.setTimestamp()
            msg.channel.send(embed)
        })
    }
    if (msg.content.toUpperCase().startsWith(".status".toUpperCase()))
    {
        var url = urlBase + "status"
        rp(url)
        .then(function(html)
        {
            var html2 = JSON.parse(html)
            
            let embed = new Discord.MessageEmbed()
            embed.setTitle('/status API Endpoint')
            embed.setDescription("FortniteGame Status")
            embed.addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Version: ', value: html2.currentFortniteVersion, inline: false },
                { name: 'CDN Version: ', value: html2.currentCdnVersion, inline: false },
                { name: 'Season (Release Version): ', value: html2.currentFortniteVersionNumber, inline: false },
                { name: 'Main Paks: ', value: html2.totalPakCount, inline: false },
                { name: 'Dynamic Paks: ', value: html2.dynamicPakCount, inline: false },
                { name: 'Mountable Pak Files: ', value: html2.mountedPaks.length, inline: false },
                { name: '\u200B', value: '\u200B' },
            )
            embed.setTimestamp()
            msg.channel.send(embed)
        })
    }
    if (msg.content.toUpperCase().startsWith(".export".toUpperCase()))
    {
        var url = urlBase + "exportAsset"
        url += "?path=" + msg.content.toString().toUpperCase().replace(".export ".toUpperCase(), "")
        rp(url)
        .then(function(html)
        {
            var html2 = JSON.parse(html)
            let embed = new Discord.MessageEmbed()
        })
    }
    if (msg.content.toUpperCase().startsWith(".help".toUpperCase()))
    {
        let embed = new Discord.MessageEmbed()
        embed.setTitle("Help")
        embed.setDescription("Here are some useful commands: ")
        embed.addFields(
            { name: '‎', value: '\u200B' },
            { name: "Request AES Keys: ", value: '`.aes`', inline: false },
            { name: "Search all Cosmetics: ", value: '`.search <item name>`', inline: false },
            { name: "Backend Store Information: ", value: '`.calendar-store`', inline: false },
            { name: "Activated/Deactivated LTMs: ", value: '`.ltm`', inline: false },
            { name: "Upcoming Events: ", value: '`.calendar-event`', inline: false },
            { name: "Active/Upcoming Shop Sections: ", value: '`.shop-sections`', inline: false },
            { name: "FortniteGame Status Info: ", value: '`.status`', inline: false },
            { name: '‎', value: '\u200B' },
        )
        embed.setTimestamp()
        embed.setFooter("Help Window")
        msg.channel.send(embed)
    }
});

client.login('Your Token, Madam?');
