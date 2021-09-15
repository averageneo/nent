### My Approch

<h3>Standalone and Stateless</h3>
<p>As written in the assignment, the system should be able to handle millions of requests. the vital step to take here is coding in a way that let us scale the back-end application on X-Axis, so our code should standalone and stateless so it can be replicated on Kubernetes, Swarm or EC2.</p>

<h3>Caching</h3>
<p>Clustering part aside, when you are about to handle millions of requests you would like to cache requests on Redis. first time a user asks for a trailer it may take a couple of seconds, but the next time the request is cached hence the response would be  million times better.</p>

<h3>What if we don't have the data in the cache?</h3>
<p>Well, the Redis docker instance has volumed, so data will not be lost, however our cache has a lifetime(We can increase the data lifetime or make it everlasting), if cached data lifespan is finished, the code would still be very fast as we keep data in a postgres database. so again we wouldn't need to go through all the logic</p>

### Run

<p>Rhe project is dockerized, you need to make sure you have docker and docker-compose installed on your machine, enter the commands below in the root directory of the project:</p>


**P.S: make sure ports 5432, 3000 and 6379 are not busy.**

```
docker-compose up --force-recreate --build -d
```
stop: 

```
docker-compose down
```

### API Endpoint

<p>You will need to make GET request to the base url of <code>127.0.0.1:3000/trailers</code> and your viaplay link as <strong>query string</strong> to the key of <code>viaplay_url</code>.</p>

<p>Template:</p>

```
127.0.0.1:3000/trailers?viaplay_url=VIAPLAY_URL
```

<p>Instead of that VIAPLAY_URL in the address above, place your own url from viaplay. </p>

Example:

```
GET 127.0.0.1:3000/trailers?viaplay_url=https://content.viaplay.se/pc-se/film/arrival-2016
```



### Unit-Tests

<p>I have implemented Factory Method Pattern which is a creational design pattern for unit testing hence we don't need to hardcode properties of classes to create testing objects.</p>
<p>NestJs itself uses Dependency Injection Design Pattern so our codebase is super clean</p>

**P.S:You have to make sure the docker instances are up before running the unit-tests**

<p>Run the command below in the root directory of the project to run tests while docker-compose is up:</p>

```
npm run test
```


<br>
<br>
<br>
<br>

<p>P.S: Tests are next to our service and controller under <strong>src/modules/trailers</strong> directory</p>

### Credits

Author: Hossein Heydari
<br>
Email: binary01ninja@gmail.com