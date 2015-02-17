# CSGO Rank Match
Have you ever had more than 5 people that all wanted to play together, but can't
because of the lobby maximum? Have you then wanted to create 2 lobbies, and play
against each other? This tool will take a list of provided ranks and split them
into 2 teams where the average rank is similar (or at least close). This will
make each lobby 'compabitible' with each other.

### Online Demo:
https://www.fatboyxpc.com/csgo-rankmatch

### How to Use
This tool is a jquery plugin, so you don't have to use the online demo. The
plugin is built so that you can pass it a form with rank inputs, or just call
the method and pass it some options.

Currently, there are only two options you can pass: ```set``` and
```delta```. ```set``` is an array/list of strings that you want to split into two teams. For
example: ```["GN1", "GN2", "MG1", "MG2"]```. ```delta``` is the minimum
difference (of each team's average rank) you want to see between the two teams.*
You can find a complete list of the Rank strings
[here](https://github.com/FatBoyXPC/csgo-rankmatch/blob/master/rankmatch.js#L11).

*This feature is not yet implemented, coming soon.


### Tips (for successful lobby pairing)
Delta of 0.2-0.6, maximum of 1.2

In my experience, you don't want the delta to be 0 (the average team rank would
be the same), as CS:GO Matchmaking seems to want a team that "should" be better
than the other.

Set ```mm_dedicated_search_maxping``` to an appropriate value for your player
base. For example, if you have somebody somebody in Florida, but somebody else
is in Vancouver, you won't want your maxping to be 30. I generally have all my
friends set it to 350 when we try to pair lobbies. This doesn't mean you will be
placed in a server with 350 ping, it just means "filter out servers with 350
ping or higher".

Delegate Lobby responsibility. There are 2 roles per team in this setup: Lobby
Leader, 2nd in Charge/line/etc. The Lobby Leader is the person that created the
lobby (sets the map, presses go, etc). The 2nd in charge is the guy who is
immediately after the lobby leader. They are responsible for calling out how
many players have accepted the match. The lobby leader should refrain from
immediately clicking accept. Everybody else should click accept immediately. At
this point, the 2nd person from each lobby should be communicating "1 out of 10"
and so on. Assuming nobody is talking, this should make it real clear if the
lobbies are in sync with each other. Once both lobbies get to 8/10, ONE lobby
leader will click accept. If the other lobby also shows 9/10, there's a very
high chance that the lobbies are matched up. We've only had this not be the case
one time. This is also your last chance to decide if the lobbies are matched up.



### Data
Delta | Count
----- | ----
0     | 4
0.2   | 14
0.4   | 7
0.6   | 8
0.8   | 4
1     | 5
1.2   | 2
Total | 44

How did I calculate this data? If you look at the Rank Strings link above, you
will see that I essentially gave each rank a value. I started at 1 (Silver 1),
and ended at 18 (Global Elite). Each game I played, if all 10 players had a rank
at the end, I recorded all 10 ranks. I then did the math using the numbers I
assigned. Add values and divide by 5 (for both teams); that's the average team
rank. Please note that this data was recorded in the Silver Elite - Master 
Guardian 2 range. I'll try to get some higher data up through Legendary Eagle
(Master), but it's hard for me to play on my main with my friends without
dropping rank.