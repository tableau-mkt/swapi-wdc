Star Wars API Web Data Connector [![Build Status](https://travis-ci.org/tableau-mkt/swapi-wdc.svg?branch=master)](https://travis-ci.org/tableau-mkt/swapi-wdc)
================================

A Tableau Web Data Connector that allows you to perform visual analysis on data
from the [Star Wars API][1] using [Tableau Desktop][2] or [Tableau Public][3].

Just want to play with the data? Open up Tableau and find "Web Data Connector"
under the list of data sources you can connect to. Copy and paste the following
URL into the connection dialog: `https://tableau-mkt.github.io/swapi-wdc/`.

Not sure what a Web Data Connector is? [Find out more about WDCs][4].


## Acknowledgement

This WDC is an amalgamation of many cool tools and technologies. Thanks in
particular to these folks for sharing their code and making this WDC possible:

- [Raymond Camden][5] for the [SWAPI-Wrapper][6]
- [Tim Pietrusky][7] for the [Star Wars opening crawl][8]
- [Paul Hallett][9] [& co][10] for creating and maintaining the Star Wars API


## Contributing

If you find a bug or would like to see a feature implemented, create a new issue
in the [issue tracker][11]. Pull requests are also welcome and encouraged!

#### Development

You will need [node][12] and [grunt][13] installed. With that in mind:

0. Clone this repository
0. Install dependencies with `npm install`
0. Start the connector with `grunt`
0. Run/debug the connector in the [simulator][14] or Tableau at `http://localhost:9001`
0. Make changes to source files
0. Run tests with `npm test`
0. Commit changes, push them to your fork, and open a PR!


[1]: http://swapi.co
[2]: https://www.tableau.com/products/desktop
[3]: https://public.tableau.com
[4]: http://onlinehelp.tableau.com/current/api/wdc/en-us/help.htm
[5]: http://www.raymondcamden.com/
[6]: https://github.com/cfjedimaster/SWAPI-Wrapper
[7]: http://timpietrusky.com/
[8]: http://codepen.io/TimPietrusky/pen/eHGfj
[9]: http://phalt.co/?ref=swapi
[10]: http://swapi.co/about
[11]: https://github.com/tableau-mkt/swapi-wdc/issues
[12]: https://nodejs.org/en/
[13]: http://gruntjs.com/getting-started#installing-the-cli
[14]: http://tableau.github.io/webdataconnector/Simulator.html?src=http://tableau-mkt.github.io/swapi-wdc/
