class LoadingService {
  private static instance: LoadingService;
  private constructor() {}

  public static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  public showLoading() {
    const loader = document.querySelector(".loading-container");
    if (loader) {
      loader.classList.remove("hidden");
    }
  }

  public hideLoading() {
    const loader = document.querySelector(".loading-container");
    if (loader) {
      loader.classList.add("hidden");
    }
  }
}

const Loading = LoadingService.getInstance();

export default Loading;
