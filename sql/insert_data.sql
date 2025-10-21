INSERT INTO photoclubuser VALUES
('43188856-13db-410a-b1a2-b006056cd84f', 'max 1', 'amoinus@gmail.com',     'hi', 'admin' ),
('beebdcae-ba00-4c16-9e1c-2103381337bf', 'max 2', 'maxwelltang@umass.edu', 'hi', 'eboard');

INSERT INTO photo(id, authorid, file, postdate) VALUES
(1, '43188856-13db-410a-b1a2-b006056cd84f', '01.png', '2020-03-15 14:30:00'),
(2, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '02.png', '2020-07-22 16:45:00'),
(3, '43188856-13db-410a-b1a2-b006056cd84f', '03.png', '2021-01-10 09:15:00'),
(4, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '04.png', '2021-05-18 12:20:00'),
(5, '43188856-13db-410a-b1a2-b006056cd84f', '05.png', '2022-02-28 18:00:00'),
(6, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '06.png', '2022-08-14 11:30:00'),
(7, '43188856-13db-410a-b1a2-b006056cd84f', '07.png', '2023-04-03 15:45:00'),
(8, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '08.png', '2023-11-12 13:10:00'),
(9, '43188856-13db-410a-b1a2-b006056cd84f', '09.png', '2024-06-25 17:30:00');

INSERT INTO tag VALUES
('nature'),
('water'),
('sky'),
('people'),
('Summer Contest');

INSERT INTO phototag VALUES
(1, 'nature'        ),
(1, 'sky'           ),
(2, 'people'        ),
(3, 'nature'        ),
(3, 'sky'           ),
(3, 'Summer Contest'),
(5, 'nature'        ),
(5, 'Summer Contest'),
(5, 'Summer Contest'),
(7, 'people'        ),
(8, 'nature'        ),
(9, 'sky'           );
