import { ThreadPrimitive } from "@assistant-ui/react";

export const MyThreadWelcome = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="mx-auto flex max-w-7xl flex-grow flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center font-sans text-3xl font-light">
                Welcome 👋
              </h1>
            </div>
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};
