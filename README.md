# Burrito Map

When I interned in California, I lived off burritos. I ate probably dozens of
burritos that summer alone. Ever since, eating burritos has become my
hobby and I made it my life's mission to eat one burrito from every restaurant
in the world.

This map keeps track of all the burritos I've eaten.

## Why this is cool

This project uses Mapbox. I wanted to make the number of burritos I've eaten big
letters that wrap around the globe like the Universal Pictures logo (as seen before every movie), but [Mapbox doesn't support this](https://github.com/mapbox/mapbox-gl-js/issues/11358). In order to recreate this effect, I had to make a workaround. I took the font file, converted each glyph to a polygon, and then add the polygons to the map.
