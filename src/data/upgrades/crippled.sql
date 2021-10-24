CREATE TABLE IF NOT EXISTS crippled_temp_1 (
     TimeIndex INT(10) NOT NULL,
     KuskiIndex INT(10) NOT NULL,
     LevelIndex INT(10) NOT NULL,
     CrippledType TINYINT(1) NOT NULL,
     Time INT(10),
     Driven INT(10),
     Finished CHAR(1) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci'
);

# insert all records into a temporary table that has no indexes on it.
# should be faster like this, but also, later we can select * from this table
# and order by TimeIndex before inserting into crippled.

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

INSERT INTO crippled_temp_1
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

# this is where we have to order 3.5 mil rows and then insert into
# table that might have indexes on it.
# if issues occur I expect it might be here.
INSERT INTO crippled
SELECT
NULL AS CrippledIndex,
TimeIndex,
KuskiIndex,
LevelIndex,
CrippledType,
Time,
Driven,
Finished
FROM crippled_temp_1
ORDER BY TimeIndex ASC;

# Verify results:
# SELECT CrippledType, COUNT(CrippledType) from crippled_temp_1 GROUP BY CrippledType ORDER BY CrippledType;
# SELECT CrippledType, COUNT(CrippledType) from crippled GROUP BY CrippledType ORDER BY CrippledType;

# For reference, dev crippled table (live will be similar):
# "CrippledType","COUNT(CrippledType)"
# "1","38561"
# "2","291810"
# "3","1098685"
# "4","1040454"
# "5","80090"
# "6","1468904"
# "7","222829"
# "8","32"
