import { uploadGame } from "@/server/data";
import {
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
	type ActionFunctionArgs,
} from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
	const uploadHandler = unstable_createMemoryUploadHandler({
		maxPartSize: 500_000_000,
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
