import { uploadGame } from "@/server/data";
import {
	json,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
	type ActionFunctionArgs,
} from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
	// Use MemoryUploadHandler with a safe limit (50MB) to avoid memory exhaustion.
	// GBA ROMs are typically small (<32MB), so this should be sufficient.
	const uploadHandler = unstable_createMemoryUploadHandler({
		maxPartSize: 50_000_000,
	});

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);

	const name = formData.get("name") as string;
	const file = formData.get("game_file") as File;

	if (!file || typeof file === "string") {
		return json({ errors: { game_file: "Invalid file upload" }, success: false });
	}

	const res = await uploadGame({ name, file: file });

	if (Object.keys(res?.errors ?? {}).length > 0) {
		return json({ errors: res?.errors, success: false });
	}

	return json({ success: true, errors: {} });
};
