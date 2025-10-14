INSERT INTO photoclubrole VALUES
('admin',  true ),
('member', false),
('eboard', true );

INSERT INTO photoclubuser VALUES
('43188856-13db-410a-b1a2-b006056cd84f', 'max 1', 'amoinus@gmail.com',     'hi', 'admin' ),
('beebdcae-ba00-4c16-9e1c-2103381337bf', 'max 2', 'maxwelltang@umass.edu', 'hi', 'eboard');

INSERT INTO photo(id, authorid, file) VALUES
(1, '43188856-13db-410a-b1a2-b006056cd84f', '01.png'),
(2, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '02.png'),
(3, '43188856-13db-410a-b1a2-b006056cd84f', '03.png'),
(4, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '04.png'),
(5, '43188856-13db-410a-b1a2-b006056cd84f', '05.png'),
(6, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '06.png'),
(7, '43188856-13db-410a-b1a2-b006056cd84f', '07.png'),
(8, 'beebdcae-ba00-4c16-9e1c-2103381337bf', '08.png'),
(9, '43188856-13db-410a-b1a2-b006056cd84f', '09.png');

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
