## What does this do?

Get a JSON from [here](http://files.peg.co/zoella_videos.json) and return the following as a JSON:

- The title of the video with the highest percentage of likes vs. dislikes
- The average (mean) percentage of likes vs. dislikes for the 12 videos
- The total number of views for all 12 videos
- the average (mean) time interval between Zoella's last 12 videos

# What do I need to run this?

Just Node and NPM. Type:

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Move into the project folder and type:

```
npm start
```

The first run will download the libraries needed by it so it could take a couple of seconds. You will see the result as JSON in the terminal.
