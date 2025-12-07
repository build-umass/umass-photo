INSERT INTO photoclubrole VALUES
('admin',  true ),
('member', false),
('eboard', true );

INSERT INTO photoclubuser VALUES
('43188856-13db-410a-b1a2-b006056cd84f', 'max 1', 'amoinus@gmail.com',     'hi', 'eboard'),
('beebdcae-ba00-4c16-9e1c-2103381337bf', 'max 2', 'maxwelltang@umass.edu', 'hi', 'member');

INSERT INTO photo(id, title, authorid, description, file, postdate) VALUES
(1, 'title 1', '43188856-13db-410a-b1a2-b006056cd84f', 'description 1', '01.png', '2020-03-15 14:30:00'),
(2, 'title 2', 'beebdcae-ba00-4c16-9e1c-2103381337bf', 'description 2', '02.png', '2020-07-22 16:45:00'),
(3, 'title 3', '43188856-13db-410a-b1a2-b006056cd84f', 'description 3', '03.png', '2021-01-10 09:15:00'),
(4, 'title 4', 'beebdcae-ba00-4c16-9e1c-2103381337bf', 'description 4', '04.png', '2021-05-18 12:20:00'),
(5, 'title 5', '43188856-13db-410a-b1a2-b006056cd84f', 'description 5', '05.png', '2022-02-28 18:00:00'),
(6, 'title 6', 'beebdcae-ba00-4c16-9e1c-2103381337bf', 'description 6', '06.png', '2022-08-14 11:30:00'),
(7, 'title 7', '43188856-13db-410a-b1a2-b006056cd84f', 'description 7', '07.png', '2023-04-03 15:45:00'),
(8, 'title 8', 'beebdcae-ba00-4c16-9e1c-2103381337bf', 'description 8', '08.png', '2023-11-12 13:10:00'),
(9, 'title 9', '43188856-13db-410a-b1a2-b006056cd84f', 'description 9', '09.png', '2024-06-25 17:30:00');

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

INSERT INTO event VALUES
(1, 'Spring Photo Walk',  '2025-04-12 09:00:00', '2025-04-12 17:00:00', 'nature',         'A community walk to photograph spring blooms.',        '01.png'),
(2, 'Summer Contest',     '2025-07-01 00:00:00', '2025-07-31 23:59:59', 'Summer Contest', 'Monthly summer photo contest; open to all members.',   '05.png'),
(3, 'Night Sky Workshop', '2025-09-15 20:00:00', '2025-09-15 23:30:00', 'sky',            'Learn long exposure techniques for astrophotography.', '09.png'),
(4, 'Waterfall Hike',     '2025-05-20 08:00:00', '2025-05-20 14:00:00', 'water',          'Day trip to nearby waterfall for landscape shots.',    '02.png'),
(5, 'Portrait Session',   '2025-11-08 18:00:00', '2025-11-08 20:00:00', 'people',         'Portrait lighting and posing session.',                '07.png');
