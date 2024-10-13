export {}

declare module "vue" {
	interface ComponentCustomProperties {
		handleUpdate: (key: undefined | string) => undefined | string
	}
}
