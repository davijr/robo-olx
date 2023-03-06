
export class AppUtils {

    static async sleep(seconds: number): Promise<void> {
        return new Promise(resolve => {
          setTimeout(resolve, seconds * 1000);
        });
    }
    
}