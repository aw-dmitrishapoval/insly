--
-- Creating tables
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `code` int(11) NOT NULL,
  `current` tinyint(1) NOT NULL,
  `contact` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `employee_info` (
  `employee_id` int(11) NOT NULL,
  `lang` enum('en','sp','fr') NOT NULL,
  `introduction` text NOT NULL,
  `experience` text NOT NULL,
  `education` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `action` enum('create','edit') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `employee_info`
  ADD PRIMARY KEY (`employee_id`,`lang`);

ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- User adding
--

INSERT INTO employee (name, birthday, code, current, contact) VALUES ('Quentin', CURRENT_DATE(), '12345', '1', 'Los Angeles');
INSERT INTO employee_info (employee_id, lang, introduction, experience, education) VALUES ((SELECT MAX(id) FROM employee), 'en', 'Text eng', 'Text2 eng', 'Text3 eng');
INSERT INTO employee_info (employee_id, lang, introduction, experience, education) VALUES ((SELECT MAX(id) FROM employee), 'fr', 'Text fra', 'Text2 fra', 'Text3 fra');
INSERT INTO employee_info (employee_id, lang, introduction, experience, education) VALUES ((SELECT MAX(id) FROM employee), 'sp', 'Text spa', 'Text2 spa', 'Text3 spa');
INSERT INTO log (admin_id, employee_id, date, action) VALUES ('1', (SELECT MAX(id) FROM employee), CURRENT_TIME(), 'create');


--
-- Get first user info
--

SELECT * FROM employee e LEFT JOIN employee_info ei ON e.id = ei.employee_id WHERE e.id = 1





