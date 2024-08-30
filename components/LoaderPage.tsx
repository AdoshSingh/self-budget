import { Spinner } from "@/components/ui/spinner";

const LoaderPage = () => {
  return (
    <div className=" bg-white h-screen w-screen flex items-center justify-center absolute z-20 top-0 left-0">
      <Spinner>Loading...</Spinner>
    </div>
  );
};

export default LoaderPage;
