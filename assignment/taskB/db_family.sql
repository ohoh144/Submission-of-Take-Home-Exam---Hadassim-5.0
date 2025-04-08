/*run 1:*/

CREATE DATABASE IF NOT EXISTS db_family;
USE db_family;

CREATE TABLE IF NOT EXISTS Person(
    Person_Id VARCHAR(9) PRIMARY KEY,
    Personal_Name VARCHAR(100),
    Family_Name VARCHAR(100),
    Gender VARCHAR(6),
    Father_Id VARCHAR(9) NULL,
    Mother_Id VARCHAR(9) NULL,
    Spouse_Id VARCHAR(9) NULL,
    FOREIGN KEY(Father_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY(Mother_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY(Spouse_Id) REFERENCES Person(Person_Id)
);

CREATE TABLE IF NOT EXISTS FamilyTree(
    Person_Id VARCHAR(9),
    Relative_Id VARCHAR(9),
    Connection_Type ENUM('father', 'mother', 'brother', 'sister', 'son', 'daughter', 'male spouse', 'female spouse'),
    PRIMARY KEY(Person_Id, Relative_Id),
    FOREIGN KEY (Person_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES Person(Person_Id)
);



/*run 2:*/

INSERT IGNORE INTO Person
VALUES 
	('245875542','Gila','Houri', 'female',NULL, NULL, NULL),
    ('205485596','Michael','Houri','male',NULL,NULL, '245875542'),
    ('205425587', 'Meitavel', 'Simhi', 'female', '205485596', '245875542', NULL),
    ('204521154','Chani','Mamou','female','205485596','245875542',NULL),
    ('025475884','Refael','Houri', 'male','205485596','245875542', NULL),
    ('025475885','personOdelya','Magrafta', 'female','205485596','245875542', NULL),
    ('204525869','Ayala','Houri', 'female','205485596','245875542',NULL),
    ('305269985','Chaim','Magrafta', 'male',NULL,NULL,'025475885');


INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Father_Id, 'father'
FROM Person AS p 
WHERE p.Father_Id IS NOT NULL;

INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Mother_Id, 'mother'
FROM Person AS p 
WHERE p.Mother_Id IS NOT NULL;

INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id, 
       CASE WHEN p2.Gender = 'male' THEN 'brother' ELSE 'sister' END
FROM Person AS p1
JOIN Person AS p2
ON ((p1.Father_Id = p2.Father_Id AND p1.Father_Id IS NOT NULL) 
     OR (p1.Mother_Id = p2.Mother_Id AND p1.Mother_Id IS NOT NULL))
AND p1.Person_Id != p2.Person_Id;

INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id, 
       CASE WHEN p2.Gender = 'male' THEN 'son' ELSE 'daughter' END
FROM Person AS p1
JOIN Person AS p2
ON (p1.Person_Id = p2.Father_Id OR p1.Person_Id = p2.Mother_Id)
AND p1.Person_Id != p2.Person_Id;

INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id, 
       CASE WHEN p2.Gender = 'male' THEN 'male spouse' ELSE 'female spouse' END
FROM Person AS p1
JOIN Person AS p2
ON p1.Spouse_Id = p2.Person_Id AND p1.Spouse_Id IS NOT NULL;

/* update supouse */
INSERT IGNORE INTO FamilyTree(Person_Id, Relative_Id, Connection_Type)
SELECT ft.Relative_Id, ft.Person_Id,
       CASE ft.Connection_Type
           WHEN 'male spouse' THEN 'female spouse'
           WHEN 'female spouse' THEN 'male spouse'
       END
FROM FamilyTree ft
LEFT JOIN FamilyTree ft2
  ON ft.Relative_Id = ft2.Person_Id AND ft.Person_Id = ft2.Relative_Id
  AND (
      (ft.Connection_Type = 'male spouse' AND ft2.Connection_Type = 'female spouse') OR
      (ft.Connection_Type = 'female spouse' AND ft2.Connection_Type = 'male spouse')
  )
WHERE ft.Connection_Type IN ('male spouse', 'female spouse')
  AND ft2.Person_Id IS NULL;


SELECT * FROM Person;
SELECT * FROM FamilyTree;


/*
DROP TABLE FamilyTree;
DROP TABLE Person;
/*
