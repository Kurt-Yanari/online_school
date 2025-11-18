CREATE TABLE `session_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`tutor_id` int NOT NULL,
	`proposed_time` timestamp NOT NULL,
	`duration_minutes` int DEFAULT 60,
	`subject` varchar(255),
	`message` text,
	`status` enum('pending','accepted','declined','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tutor_id` int NOT NULL,
	`student_id` int NOT NULL,
	`scheduled_time` timestamp NOT NULL,
	`duration_minutes` int DEFAULT 60,
	`status` enum('scheduled','completed','cancelled','no_show') DEFAULT 'scheduled',
	`subject` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`grade_level` varchar(50),
	`interests` text,
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `tutor_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`specializations` text,
	`bio` text,
	`hourly_rate` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0.00',
	`total_sessions` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutor_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `tutor_profiles_user_id_unique` UNIQUE(`user_id`)
);
