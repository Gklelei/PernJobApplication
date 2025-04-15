ALTER TABLE `job_applications` DROP FOREIGN KEY `job_applications_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `job_applications` DROP FOREIGN KEY `job_applications_job_id_job_posting_id_fk`;
--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_job_id_job_posting_id_fk` FOREIGN KEY (`job_id`) REFERENCES `job_posting`(`id`) ON DELETE cascade ON UPDATE no action;