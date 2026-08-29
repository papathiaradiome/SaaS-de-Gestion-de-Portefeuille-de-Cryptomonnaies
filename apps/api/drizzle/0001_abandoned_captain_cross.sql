CREATE TABLE `assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`coingecko_id` text NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assets_coingecko_id_unique` ON `assets` (`coingecko_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `assets_symbol_unique` ON `assets` (`symbol`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`asset_id` integer NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`fees` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`executed_at` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `transactions_user_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `transactions_user_asset_idx` ON `transactions` (`user_id`,`asset_id`);