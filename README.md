Inertia.js
==========

A simple JQuery plugin for inertia. Simply run $.inertia on the element you want to 
listen for drags, and the plugin does the rest. Currenly only has mouse support (not 
touch, alas). 

The plugin takes four optional values for the plugin: A maximum scroll velocity 
allowed (in pixels per second), a falloff rate for inertia (kind of like an inverse
mass function, bounded between 0 and 1. 0 means an instant falloff, 1 means no 
falloff. The value is in energy lost per second), a callback function for velocity 
reporting, and refresh rate which tells 
how often the refresh function is called (in milliseconds).

The callback function you provide will be called with an object passed to it. This
object will contain two values: xVelocity and yVelocity, which (obviously) give the
current velocity that the item is feeling.

See the sample html file for usage.

Cheers.
