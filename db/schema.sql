-- Database, one table that contains a snapshot of a race, date, name, location, with a foreign key to another table.
-- Oooh, that would get complicated fast... That's bad design. Forget the foreign key part.
-- Query to historical weather data. Somehow linked to each race each year...Birkie for last 5 years.
-- Finally, a table that contains a reference to the race information snapshot table
-- This table would contain as much info about wax choice as possible
-- all measurements stored in metric
-- cm for snowfall, km for race length, celsius for temperature

create table users (
    id SERIAL primary key,
    name varchar(200),
    firstname varchar(150),
    lastname varchar(150),
)

-- i.e., American Birkiebeiner
create table skiraces (
    id SERIAL primary key,
    race varchar(200),
    racelocation varchar(200)
)

-- i.e., Korteloppet
create table racesubevents (
    id SERIAL primary key,
    racename varchar(200),
    parentrace varchar(200),
    racelength integer
)

create table myraces (
    id SERIAL primary key,
    reporter varchar(200),
    race foreign key references skiraces(id),
    subevent foreign key references racesubevents(id),
    racedate date,
    finishtime interval,
    waxused varchar(150),
    waxrating integer,
    racerating integer,
    racer foreign key references users(id),
)

-- wax color is a hex code?
-- fluoro is yes/no
create table skiwax (
    id serial primary key,
    wax varchar(150),
    manufacturer varchar(150),
    waxtype varchar(50),
    waxcolor varchar(6),
    fluoro bit not null
)

create table hotspots (
    id serial primary key,
    name varchar(150),
    latitude point,
    longitude point,
    recordedsnowfall foreign key references recentsnowfall(id),
    manmadesnow boolean
)

create table recentsnowfall (
    id serial primary key,
    depth varchar(150),
    temperature integer
)
