CREATE TABLE appointments (
	id serial,
	firstname varchar(30) NOT NULL,
	lastname varchar(30) NOT NULL,
	email varchar(50) NOT NULL UNIQUE,
	phone varchar(20) NOT NULL,
	appointment varchar(50) NOT NULL UNIQUE,
	day varchar(50) NOT NULL,
	time varchar(50) NOT NULL
);

ALTER TABLE
	appointments
ADD
	CONSTRAINT PK_appointments PRIMARY KEY (id);