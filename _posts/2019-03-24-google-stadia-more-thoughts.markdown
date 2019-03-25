---
layout: post
type: blog
title:  "More thoughts on Google Stadia"
description: "After a few days of letting it sink in, I've gathered more thoughts on Google's not-console console. (Yes more!)"
date:   2019-03-24 15:00:20 -0700
tags: Google Stadia Console Thoughts
excerpt_separator: <!--more-->
published: true
---
![Stadia](/assets/stadia-logo.png)

After a few days of letting this swirl around my head, I'm still having thoughts about this not-console console. I still don't love the idea from a game developer point of view, which I'll share why, but at the same time, I'm starting to feel out some potential in the project.
<!--more-->
## What's not to love?

The main thing that's holding back excitement over this idea is the lack of available client computation power. Consoles have always been interesting to develop for because they're a known and limited hardware platform; you know exactly (well, mostly) what your player base will be experiencing your game on, you know how far you can push it and what tricks are available to you. Think of features like the Super Nintendo's Mode7 feature, The PlayStation 3's HDD. The counter to those features were things like the Xbox 360 HDD at launch, it was optional and therefore you had no guarantee as a developer that your players would have an HDD. To resolve this you had to either build a game that could both work with and without it adding all the complexities of that, or just not use it and limit the ability of your game.

Stadia as a console has no local client in its design, in its simplest form it's the controller which connects via the router to their servers and a dongle that receives the sound and vision from the servers. So to make a game that works on Stadia, that you're target basis for maximum compatibility.
Many player's using Stadia however could be using their PC and the Chrome browser to play, with access to lots of local storage, CPU power, GPU power, memory, all of this hardware cannot be used outside of decoding the sound and vision.

![Stadia](/assets/controller-stadia.jpg)

Stadia is:
* A Fast Internet connection
* A screen with hardware capable of running Chrome or allowing input from their HDMI dongle
* A WiFi Game Controller

So in looking to disrupt the console and gaming market, Google has taken this very bold avenue to completely cut out all nearly all local hardware requirements in order to achieve the maximum potential of device compatibility. Pushing all major hardware features to their server architecture.

## Warming to the idea

My argument is moot if you look at just making the claim that all the console hardware I talk about is available it's just that it's held in the server. So you could look at Stadia as being a traditional game console with known hardware specs, but that console doesn't sit under the TV it sits in a data centre. And this does present some interesting avenues for development of new styles of experience.

## Low Barrier to entry

There's simply no denying this, the greater opportunity for people to find a way to play games and be entertained is never a bad thing (Unless it takes over the important tasks in your life), so getting that reach across devices without the need of expensive parts is great.

## Near Instant Play

The allure for pressing Play and being right in the game is just as if not more exciting than the low hardware requirement. It lets you fulfil that urge quickly and if Google can build a strong library then you have potentially any game right there at your fingertips whenever you want. You're free to try out many different games without the burden of downloading massive amounts of data before getting underway. Many of the AAA games now are massively growing in size too, even modern consoles require heavy management of HDD space in order to ensure you have enough free space to download games. There's no way of having all of your PS4 games installed on the machine at once, so you're left deciding which games you want to uninstall in order to add new ones or play one of your older games. No one wants to deal with this just as we don't generally care about our photos and videos captured on our phones, they can just be uploaded to online storage and forgotten about. So games can now start to fall into that category.

## Harder to Hack

With less or no code that can be accessed by the player, it gives little in the way of being able to hack games and create exploits, which for multiplayer games especially is great as it means players will get the intended experience, and won't have their game spoiled by others. Also with the developer having control over the software, they can ensure that clients are always running the latest code.

## Split Rendering Pipelines

On current systems, whatever happens in a game, even a multiplayer one with many clients connected, all have to filter down to each individual device for rendering. There's a cost to this as data has to be managed by the local device's CPU/Memory/GPU for unpacking, building and rendering to screen. We have many tricks for doing this well including utilising multiple CPU cores to distribute the load and omitting data which isn't required to be seen. Think of a large fantasy world with many creatures, forests, lakes, mountains. If the player is standing in a cave, the system doesn't need to care about processing all that information because it's unseen to the player, so it culls the world down to just the surrounding information. Other information updates can happen periodically to simulate ongoing life, or just when required using time elapsed since the last update.

With Stadia it's feasible to use access to the many servers to split the calculations and potentially even the rendering portions of the world before combining them and sending them to the player's TV.

This has the potential to allow for rendering scenes and situations, say thousands of characters, beyond what is achievable on a home PC or console.

## A Tale of Caution for Developers

I'd say that if you're building a game today that isn't doing anything too wild, say an action, adventure, or puzzle game, then it's probably a no brainer to add your game to the Stadia platform and see how the service works for you. There are some requirements for the hardware, IIRC it's a Linux based setup using the Vulkan Graphics API, which is already becoming more standard in development pipelines anyway. The controller is a very familiar layout, so adding that would be easy, this isn't some Wii style motion controller. So yeah, get your game built and launch on this fresh new service.

If you're developing a game that has a strong dependency on running at a low latency such as a rhythm action game or a fighting game, then the service really still has to prove itself in the real world before it's known to be a good platform for such games. The speed of light is very real, and we're not beating that any time soon. There may be tricks to offset some of these costs, which it sounds Google is looking to do, also if you look at

If you're wanting to develop something that takes more use of their server infrastructure, things that I alluded to above like doing more complex server rendering to create experiences beyond what can be achieved on current consoles and PCs, then note that for one your game will have to be exclusive to that platform and two, many of these ideas that people will excitedly talk about: thousands of players, complex worlds, physics, they're so incredibly hard to produce let alone within a game environment. Also, looping back to my first comment on why I'm still not loving this approach, these types of complex ideas, in fact, most things I've talked about, could be looked at without losing all the client-side hardware. That perhaps doesn't make things any easier really, but it's more a signal to say that Stadia's remote console isn't the only possible solution we could look too for examples.

![Crackdown 3](/assets/crackdown-3-logo.jpg)

In 2014 Microsoft announced Crackdown 3 for Xbox One and PC. They were looking to put their Azure server's to work to help bring something new to gaming. Their goal was to use servers to render and create complex functionality beyond what home hardware could achieve. [2015 Pre-Alpha Footage](https://youtu.be/EWANLy9TjRc?t=304). The game shipped in 2019 without any of these features. No, it's not clear why, but it's probably fair to say that pioneering ideas like this are incredibly hard and expensive.

So Google may have the answer with their servers where Microsoft did not, developers might have better ideas on how to use the systems, and the systems might produce what is promised, there's little data to say this from a real-world perspective, and the roads aren't yet paved. A safer route overall might be to look at the other streaming services that are on the horizon, ones that offer a mixed approach of server and real client-side computation, which could a best potentially realise the dream of complex server rendering, but allow for pivots and design changes that can pull back to the client if needs be, just how Crackdown 3 did to get to launch.

![Google Grim Reaper](/assets/google-grim-reaper.jpg)

Finally, I mentioned this in my original post, but it's worth repeating. Google's Stadia is unknown in terms of life span and is undoubtedly incredibly expensive to run. Google for a time was happy at running a lot of their divisions at a loss, but that's not really been the case in recent years. They still launch products, but [most have been killed](https://killedbygoogle.com/). Stadia might well be a moonshot of Google proportions, but if it doesn't make the growth they're hoping to see then it could be added to the pile of other dead products like Google+, Google Glass, Nexus and Inbox (That one hurts to say, I loved Inbox). What happens to your game if the service is shut down if you've created something specific to their hardware you might be stuck with a dead product, if it was a more traditional style game, then it might be a case of migrating to another service, or you might already be on one. As for things like player save games and the like, Google is usually good enough to let users download their data. I still have a backup of my Google Buzz posts. 'member Google Buzz?
