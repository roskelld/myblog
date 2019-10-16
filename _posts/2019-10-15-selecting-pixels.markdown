---
layout: post
type: article
title:  "Selecting Pixels in Sparkshot"
description: "Journey through the development of Sparkshot's pixel selection feature."
date:   2019-10-15 11:00:20 -0700
tags: Sparkshot.io UI UX Art
image: /assets/sparkshot/alpha-sparkshot.io.png
excerpt_separator: <!--more-->
published: true
---

![Sparkshot.io Alpha](/assets/sparkshot/alpha-sparkshot.io.png)

[Sparkshot.io](https://sparkshot.io) is all about grabbing pixels to reveal the hidden art, but we don't just want to create a functional application, we want to build something fun and engaging.
So how did we make the act of selecting pixels on a grid interesting?
<!--more-->

## Our Goal

Our goal is to make the UX fun and responsive but not at the cost of functionality. Sparkshot has the utility of allowing artists to fund their work by selling pixels, but on the flip side to that, can the act mere act of interacting with pixels be a fun and engaging experience in their own right?

Sparkshot gives users the freedom to choose the number of pixels and where on the canvas to select them, we want to encourage the user to experiment and respond to them through small feedback loops to react to what they do, and wherever we can provide an informative response to reinforce the process.

## The Journey

### Humble Beginnings

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/1st.webm" type="video/webm">
  <source src="/assets/sparkshot/1st.mp4" type="video/mp4">
</video>

When our team spots an issue or comes up with an idea, we talk it through, sleep on it for a while, talk about it some more and if we decide it's good we will either shelf it until the time is right, or get writing some code to see if our assumptions were correct.

Sparkshot as an application is centred around this concept of selecting pixels, so we needed to jump on this feature right at the start and get something functioning that we could build around.

So we fired up our tools, which in this case is the web browser, Javascript and HTML canvas and wrote a prototype.

The prototype achieved our goal of being able to select pixels on a canvas, sure it was far from fun and lacked any strong feedback.
However, it was something we could start building around, and it allowed us to start to work on other features and push towards the full application loop of being able to select, buy and reveal the hidden art.


### Early Indications

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/2nd.webm" type="video/webm">
  <source src="/assets/sparkshot/2nd.mp4" type="video/mp4">
</video>

Once we'd added more surrounding features to the core loop of the application it rewarded us with the time to go back for a second iteration on the pixel selection feature, polishing up the accuracy of the selection as well as adding in a new UI highlighter that tracked the mouse movement and informed the user of exactly which pixel they'd be selected if they clicked.

This was an important UX step as we didn't want the user to have uncertainty about which pixel would be selected when clicking; also a feature of Sparkshot is the ability to zoom in-and-out of the art, meaning that pixel selection isn't always up close and easy to judge.

The UI highlighter was the first step in helping select pixels at greater zoom levels and something we'd spend more time improving in future updates.

### More Data

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/3rd.webm" type="video/webm">
  <source src="/assets/sparkshot/3rd.mp4" type="video/mp4">
</video>

One of the features we have for artists on Sparkshot is that they can set the price for each pixel, which is useful information for the user to know so that they can be clear on what they need to pay.

Just like with the UI highlighter feature, we wanted to report this information before selecting a pixel. So with this update, we added a new price UI element that appears when the user hovers their mouse over a pixel.

Another major part of this update was to better define selected pixels, which previously filled the entire cell with a single colour making it hard to differentiate the individual parts of a group selection.

The way that Sparkshot renders the image isn't always at a 1-to-1 pixel ratio because we allow the user to zoom in-and-out of the image. So when zoomed in close a single selectable pixel is, in reality, a square of many pixels, this gives us the freedom to add detail into that space.

With this update, we shrank the selected pixel icon leaving a clear border around it to help differentiate it from its neighbours. We also added a two-tone effect to the green to add a little style, admittedly only a little though.

With this update, things started to take form, with the UX becoming stronger and the application easier to use even when zoomed out of the image.

### Style and Motion

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/4th.webm" type="video/webm">
  <source src="/assets/sparkshot/4th.mp4" type="video/mp4">
</video>

Now that many of the core parts of the application were functioning we were able to get a good feeling of the overall experience. This complete picture gave us the idea of the time given to pixel selection and where we could add some of that playful UX.

Sparkshot at its core is about pixels, sure the artist's work is the endpoint of the journey, but we have to loop through the act of selecting and revealing pixels many times to get there.

Being mindful of the final state where art is displayed on the screen, we cannot conflict with what draws the eye; the art must win. For the most part, Sparkshot takes a back seat with its neutral colour palette UI. There is one area where we knew that we weren't going to compete with the artist, which is on the empty pixels, here we want the application to pop to help users track their selected pixels within the multitude of colours from the art itself.

To help reinforce the theme of the pixel we took the green selection icon and changed it into a more stylish pixel gem sprite, evoking the nature of the application and using a gem concept to represent the idea of value.

Gems are something which has become a sort of meme for value in the digital entertainment world thanks to its connected roots in video games where it's been common for games to use fantastical currencies such as gold, gems, rings and such. In the more modern era of microtransactions, we see many games have their currencies based on ideas like gems.

The final piece in this update was to add some animation to the loop, pushing the UX more into that playful state of taking the act of selecting pixels from functional to fun with an animated response to user input.

### Many Pixels all at once

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/6th.webm" type="video/webm">
  <source src="/assets/sparkshot/6th.mp4" type="video/mp4">
</video>

This update was interesting as it was something we'd talked about for a while but resisted adding. The feature in question was to allow users to speed up the act of selecting more than one pixel, often requested as some sort of fill tool, or box select, and up until this point users needed to click on each pixel individually to select it or deselect it.

We had just entered an early alpha stage and begun to invite users to come on board and test the application out live, and we expected and certainly heard the requests come in to allow a quicker way to select many pixels quickly.

As I said we expected this, so why hadn't we already added the feature?

Well, it was a philosophical thing really, when we set out to build this application we talked about trying to create the smallest meaningful transaction loop possible, which in our case was a single pixel.

Our goal was to build around this concept and see if we could achieve it or at least see how close we could get. We pushed to make selecting a pixel a fun experience, and felt that if we added multi-select early on then we would focus on creating an application where users were expected to select many pixels to get achieve any fun, and while this ultimately might be true, we wanted to push our idea as much as possible before we opened the pixel selection flood gates.

Another reason for resisting this feature is based around the art uploaded by artists, which represents the other side of Sparkshot. The act of selecting and revealing pixels needs to be fun, but it needs to lead to great art, and what is good art on Sparkshot?

Before I derail this with a topic that requires an article of its own, I can cover a few points that concern this feature.

One reason why users might feel that they want to select a lot of pixels is that there's a lot of pixels to select, meaning the artist has uploaded a large piece of art. Sparkshot supports up to 1000x1000 resolution images, which consist of 1,000,000 pixels. That's a lot of clicks. So perhaps there's a solution in finding good art at smaller resolutions, requiring fewer clicks and less of a feeling to need to select a lot of pixels gain a reward. We don't want to make any clear claims as of yet, but we do want to support Sparkshot through a stage where we let artists and users seek some form of balance between their needs and we'll happily support what works for both.

Anyway, back to this update. After working through to UX to this point and being satisfied with the feel and function, we added the ability to drag-select and drag-delete pixels which required some rework of the controls, which as of now are:
- Left Click - Select/Deselect
- Left Click & Hold + Drag - Multi-Select/Deselect
- Mouse Wheel - Zoom
- Right Click & Hold + Drag - Pan Art

We also updated the gem sprite with a new 3D rotation animation to help increase the motion and response of the interactions.
The new animation felt good on the single click select, but we also found that when drag selecting multiple pixels it created a fun ripple motion effect which felt encouraging, adding an extra layer to the feedback loop.

Overall we hope that our resistance to add this feature helped result in seeing the act of adding more pixels is done by the user for the extra reward and not just to achieve a base sense of engagement with Sparkshot.

### A Dead End

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/7th.webm" type="video/webm">
  <source src="/assets/sparkshot/7th.mp4" type="video/mp4">
</video>

With the controls getting more complex thanks to the added drag-select function we decided to update the UI to let the user know which mode they were in by changing the UI highlighter with an icon to display the current mode.

This update turned out to be a very short-lived version as we quickly realized that zooming out of the art renders the UI highlighter unreadable, so instead, we needed to show it on an element that wasn't affected by the zoom level.

I wanted to show this update to help highlight that it's good to test ideas and remove what doesn't work. Removing a week's worth of work is nothing when you consider the many hours' users might collectively put into the application. So test assumptions and don't be afraid to kill them if they don't work out, you still learn a good lesson to take with you even if there's nothing to show for that time.

### Polish till it shines

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/8th.webm" type="video/webm">
  <source src="/assets/sparkshot/8th.mp4" type="video/mp4">
</video>

In this update, we focused on polishing our feature set. Taking the time to improve on the systems, the visuals and taking things to the next level.

First, we scrapped the last update of adding the mode to the UI highlighter and instead put it in the much more sensible location of the mouse cursor, which does not suffer from scaling with zoom so it's readable no matter what's happening on screen.

What we did add to the UI highlighter was contextual colour based on the current select mode, which compliments the change to the mouse cursor.

We reworked the gem from scratch adding more frames of animation, more pixel detail and lighting to help it pop on the screen.

Finally, there's a new UI element to round off the feedback, which confirms to the user of the price adjustment based on the selected or deselected pixels. An animated text element floats upward after the user completes an interaction loop (releases the mouse button), which can be a one or more pixels sequence.

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/9th.webm" type="video/webm">
  <source src="/assets/sparkshot/9th.mp4" type="video/mp4">
</video>

Here's a sequence that shows off the delete action, using both a red icon and red UI highlighter to clearly confirm that the action is removing pixels.

A pixel delete animation was added too for extra polish and to hopefully make removing pixels as fun as adding them.

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/10th.webm" type="video/webm">
  <source src="/assets/sparkshot/10th.mp4" type="video/mp4">
</video>

A final piece of flair was added to the interaction loop. Given that we had all the frames of animation to rotate the gem sprite, it felt like having them react to the mouse cursor passing over them would be both a fun thing to do as well as suggest to the user that it is possible to interact with an already selected pixel, which currently is to remove it from selection, but perhaps we might add other functions in the future, who knows?

<video autoplay="autoplay" loop="loop" width="100%" height="auto">
  <source src="/assets/sparkshot/11th.webm" type="video/webm">
  <source src="/assets/sparkshot/11th.mp4" type="video/mp4">
</video>

Just to prove what I said earlier, even when zoomed out of the art selecting pixels is clear and as easy as it is zoomed in, sure you don't get the nice detailed animation (maybe we'll find a way to fix that in the future), but you can see the mode, and know what pixel you're going to select next.

### Conclusion

This brings us to where Sparkshot currently stands. We know we've got a long way to go as the application continues to grow, but we've already learned a lot of lessons, built a lot of technology, and given that this article just concerns one facet have much more to say in future articles.

If you'd like to try Sparkshot for yourself as an artist a user or both then please join our [Telegram group](https://t.me/sparkshot), we look forward to seeing you there.
