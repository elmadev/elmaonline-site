# see crippled-new.sql
INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
1 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished
WHERE LeftVolt = 0 AND RightVolt = 0 AND SuperVolt = 0;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
2 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE Turn = 0;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
3 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE Turn <= 1;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
4 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE BrakeTime = 0;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
5 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE ThrottleTime = 0;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
6 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE ThrottleTime = Time;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
7 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE OneWheel = 1;

INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
8 AS CrippledType,
Time,
Driven,
Finished
FROM allfinished WHERE Drunk = 1;
