CREATE TABLE `job_applications` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`job_id` varchar(255) NOT NULL,
	`status` varchar(255) DEFAULT 'applied',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_posting` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`location` text DEFAULT ('onsite'),
	`status` text DEFAULT ('open'),
	`requirements` text NOT NULL,
	`responsibilities` text NOT NULL,
	`qualifications` text NOT NULL,
	`skills` text NOT NULL,
	`department` varchar(255) NOT NULL,
	`type` text NOT NULL,
	`experience` varchar(255) NOT NULL,
	`salary` varchar(255) NOT NULL,
	`deadline` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `job_posting_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_posting_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` text NOT NULL DEFAULT ('user'),
	`gender` varchar(255),
	`image_url` varchar(255),
	`cv_url` varchar(255),
	`cover_letter_url` varchar(255),
	`plan` varchar(255) DEFAULT 'free',
	`applications` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_job_id_job_posting_id_fk` FOREIGN KEY (`job_id`) REFERENCES `job_posting`(`id`) ON DELETE no action ON UPDATE no action;