-- Database, one table that contains a snapshot of a race, date, name, location, with a foreign key to another table.
-- Oooh, that would get complicated fast... That's bad design. Forget the foreign key part.
-- Query to historical weather data. Somehow linked to each race each year...Birkie for last 5 years.
-- Finally, a table that contains a reference to the race information snapshot table: this table would contain info
-- about wax choice for as many participants as possible

create table skiraces (
    id SERIAL primary key,
    name varchar(200),
    location varchar(200)
)

create table myraces (
    id SERIAL primary key,
    reporter varchar(200),
    race foreign key references skiraces,
    date date,
    waxused,
    waxrating,
    racerating,
)

create table skiwax (
    id serial primary key,
    wax varchar(150),
    manufacturer varchar(150),
    type varchar(50)
)
