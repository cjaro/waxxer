create table skiraces (
    id SERIAL primary key,
    name varchar(200),
    location varchar(200)
)

create table myraces (
    id SERIAL primary key,
    race foreign key references skiraces
    date date
    waxused
    waxrating
    racerating
)

create table skiwax (
    id serial primary key
    wax varchar(150)
)
